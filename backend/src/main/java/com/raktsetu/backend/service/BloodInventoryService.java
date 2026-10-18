package com.raktsetu.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.BloodInventoryRequestDTO;
import com.raktsetu.backend.dto.BloodInventoryResponseDTO;
import com.raktsetu.backend.entity.BloodInventory;
import com.raktsetu.backend.entity.User;
import com.raktsetu.backend.enums.InventoryStatus;
import com.raktsetu.backend.repository.BloodInventoryRepository;
import com.raktsetu.backend.repository.UserRepository;
import com.raktsetu.backend.exception.BadRequestException;
import com.raktsetu.backend.exception.ResourceNotFoundException;

@Service
public class BloodInventoryService {

    private final BloodInventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final BloodStockService bloodStockService;

    public BloodInventoryService(BloodInventoryRepository inventoryRepository,
                                 UserRepository userRepository,
                                 BloodStockService bloodStockService) {
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.bloodStockService = bloodStockService;
    }

    public BloodInventoryResponseDTO addBag(BloodInventoryRequestDTO dto, String adminEmail) {

        // Bag Number Validation
        if (inventoryRepository.existsByBagNumber(dto.getBagNumber())) {
            throw new BadRequestException("Bag number already exists: " + dto.getBagNumber());
        }

        // Logged-in Admin
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Dates
        LocalDate receivedDate = LocalDate.parse(dto.getReceivedDate());

        // A bag can't be received in the future
        if (receivedDate.isAfter(LocalDate.now())) {
            throw new BadRequestException("Received date cannot be in the future");
        }

        // Auto Expiry Calculation
        LocalDate expiryDate = receivedDate.plusDays(dto.getComponent().getShelfLifeDays());

        // A bag whose calculated expiry is already in the past can't be added as fresh/available
        // stock — this would silently mark already-expired blood as usable.
        if (expiryDate.isBefore(LocalDate.now())) {
            throw new BadRequestException(
                "This bag would already be expired: received on " + receivedDate +
                ", and " + dto.getComponent() + " has a shelf life of " +
                dto.getComponent().getShelfLifeDays() + " days (expiry would be " + expiryDate + ")."
            );
        }

        BloodInventory inventory = new BloodInventory();

        inventory.setBagNumber(dto.getBagNumber());
        inventory.setBloodGroup(dto.getBloodGroup());
        inventory.setComponent(dto.getComponent());
        inventory.setQuantityMl(dto.getQuantityMl());
        inventory.setReceivedDate(receivedDate);
        inventory.setExpiryDate(expiryDate);
        inventory.setStatus(InventoryStatus.Available);
        inventory.setAddedBy(admin);

        BloodInventory saved = inventoryRepository.save(inventory);

        // Keep the blood_stock summary in sync — a new available bag adds one unit
        bloodStockService.addStock(dto.getBloodGroup(), dto.getComponent(), 1);

        return mapToDTO(saved);
    }

    // Admin edits an existing bag's details (blood group, component, quantity, received date).
    // Expiry is recalculated from the (possibly new) component's shelf life. If the bag is
    // currently Available and either blood group or component changed, the blood_stock summary
    // is corrected: one unit removed from the old group/component, one added to the new one.
    public BloodInventoryResponseDTO updateBag(Long inventoryId, BloodInventoryRequestDTO dto) {

        BloodInventory bag = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood bag not found: " + inventoryId));

        // Bag number uniqueness check (only if it's actually changing)
        if (dto.getBagNumber() != null && !dto.getBagNumber().equals(bag.getBagNumber())
                && inventoryRepository.existsByBagNumber(dto.getBagNumber())) {
            throw new BadRequestException("Bag number already exists: " + dto.getBagNumber());
        }

        boolean wasAvailable = bag.getStatus() == InventoryStatus.Available;
        var oldBloodGroup = bag.getBloodGroup();
        var oldComponent = bag.getComponent();

        LocalDate receivedDate = LocalDate.parse(dto.getReceivedDate());

        // A bag can't be received in the future
        if (receivedDate.isAfter(LocalDate.now())) {
            throw new BadRequestException("Received date cannot be in the future");
        }

        LocalDate expiryDate = receivedDate.plusDays(dto.getComponent().getShelfLifeDays());

        // Same guardrail as addBag — don't let an edit turn a bag into an already-expired one
        // while still being marked/counted as Available.
        if (expiryDate.isBefore(LocalDate.now())) {
            throw new BadRequestException(
                "This bag would already be expired: received on " + receivedDate +
                ", and " + dto.getComponent() + " has a shelf life of " +
                dto.getComponent().getShelfLifeDays() + " days (expiry would be " + expiryDate + ")."
            );
        }

        bag.setBagNumber(dto.getBagNumber());
        bag.setBloodGroup(dto.getBloodGroup());
        bag.setComponent(dto.getComponent());
        bag.setQuantityMl(dto.getQuantityMl());
        bag.setReceivedDate(receivedDate);
        bag.setExpiryDate(expiryDate);

        BloodInventory saved = inventoryRepository.save(bag);

        if (wasAvailable) {
            boolean groupOrComponentChanged =
                    oldBloodGroup != dto.getBloodGroup() || oldComponent != dto.getComponent();
            if (groupOrComponentChanged) {
                bloodStockService.deductStock(oldBloodGroup, oldComponent, 1);
                bloodStockService.addStock(dto.getBloodGroup(), dto.getComponent(), 1);
            }
        }

        return mapToDTO(saved);
    }

    // Admin deletes a bag entirely. If it was Available, deduct it from the blood_stock summary
    // first so stock counts stay accurate.
    public void deleteBag(Long inventoryId) {

        BloodInventory bag = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood bag not found: " + inventoryId));

        if (bag.getStatus() == InventoryStatus.Available) {
            bloodStockService.deductStock(bag.getBloodGroup(), bag.getComponent(), 1);
        }

        inventoryRepository.delete(bag);
    }

    public List<BloodInventoryResponseDTO> getAllInventory() {
        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<BloodInventoryResponseDTO> getExpiringSoon() {

        LocalDate threshold = LocalDate.now().plusDays(3);

        return inventoryRepository
                .findByStatusAndExpiryDateLessThanEqual(
                        InventoryStatus.Available,
                        threshold)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Admin manually updates a bag's status (e.g. mark a bag used when it's physically
    // issued, or correct a bag back to Available). Keeps blood_stock in sync: a bag
    // leaving Available deducts one unit, a bag returning to Available adds one unit.
    public BloodInventoryResponseDTO updateStatus(Long inventoryId, InventoryStatus newStatus) {

        BloodInventory bag = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood bag not found: " + inventoryId));

        InventoryStatus oldStatus = bag.getStatus();

        if (oldStatus == newStatus) {
            return mapToDTO(bag);
        }

        boolean wasAvailable = oldStatus == InventoryStatus.Available;
        boolean nowAvailable = newStatus == InventoryStatus.Available;

        if (wasAvailable && !nowAvailable) {
            bloodStockService.deductStock(bag.getBloodGroup(), bag.getComponent(), 1);
        } else if (!wasAvailable && nowAvailable) {
            bloodStockService.addStock(bag.getBloodGroup(), bag.getComponent(), 1);
        }

        bag.setStatus(newStatus);
        BloodInventory saved = inventoryRepository.save(bag);

        return mapToDTO(saved);
    }

    // Runs once every day at midnight — marks bags past their expiry date as EXPIRED
    // and removes them from the blood_stock summary so stock counts stay accurate.
    @Scheduled(cron = "0 0 0 * * *")
    public void markExpiredBags() {

        List<BloodInventory> expiredBags = inventoryRepository
                .findByStatusAndExpiryDateBefore(InventoryStatus.Available, LocalDate.now());

        for (BloodInventory bag : expiredBags) {
            bag.setStatus(InventoryStatus.expired);
            inventoryRepository.save(bag);

            bloodStockService.deductStock(bag.getBloodGroup(), bag.getComponent(), 1);
        }
    }

    private BloodInventoryResponseDTO mapToDTO(BloodInventory inventory) {

        BloodInventoryResponseDTO dto = new BloodInventoryResponseDTO();

        dto.setInventoryId(inventory.getInventoryId());
        dto.setBagNumber(inventory.getBagNumber());

        // A+, B+, O-
        dto.setBloodGroup(inventory.getBloodGroup().getLabel());

        // WHOLE_BLOOD / RBC / PLASMA
        dto.setComponentName(inventory.getComponent().name());

        dto.setQuantityMl(inventory.getQuantityMl());

        dto.setReceivedDate(inventory.getReceivedDate().toString());
        dto.setExpiryDate(inventory.getExpiryDate().toString());

        dto.setStatus(inventory.getStatus().name());

        return dto;
    }

}
