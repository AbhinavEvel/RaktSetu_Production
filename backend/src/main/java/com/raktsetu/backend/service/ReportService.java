package com.raktsetu.backend.service;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.dto.BloodInventoryResponseDTO;
import com.raktsetu.backend.dto.MonthlyDonationDTO;
import com.raktsetu.backend.dto.RequestStatusSummaryDTO;
import com.raktsetu.backend.dto.StockSummaryDTO;
import com.raktsetu.backend.entity.BloodRequest;
import com.raktsetu.backend.entity.Donation;
import com.raktsetu.backend.enums.RequestStatus;
import com.raktsetu.backend.repository.BloodRequestRepository;
import com.raktsetu.backend.repository.BloodStockRepository;
import com.raktsetu.backend.repository.DonationRepository;

@Service
public class ReportService {

    private final BloodStockRepository stockRepository;
    private final DonationRepository donationRepository;
    private final BloodRequestRepository requestRepository;
    private final BloodInventoryService inventoryService;

    public ReportService(BloodStockRepository stockRepository,
                         DonationRepository donationRepository,
                         BloodRequestRepository requestRepository,
                         BloodInventoryService inventoryService) {
        this.stockRepository = stockRepository;
        this.donationRepository = donationRepository;
        this.requestRepository = requestRepository;
        this.inventoryService = inventoryService;
    }

    // Stock levels by blood group and component
    public List<StockSummaryDTO> getStockSummary() {
        return stockRepository.findAll()
                .stream()
                .map(s -> new StockSummaryDTO(
                        s.getBloodGroup().getLabel(),
                        s.getComponent().name(),
                        s.getUnitsAvailable()))
                .toList();
    }

    // Monthly donation trends
    public List<MonthlyDonationDTO> getMonthlyDonations() {

        Map<YearMonth, List<Donation>> grouped = donationRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(d -> YearMonth.from(d.getDonationDate())));

        return grouped.entrySet()
                .stream()
                .map(e -> new MonthlyDonationDTO(
                        e.getKey().toString(),
                        (long) e.getValue().size(),
                        e.getValue().stream().mapToInt(Donation::getUnitsDonated).sum()))
                .sorted(Comparator.comparing(MonthlyDonationDTO::getMonth))
                .toList();
    }

    // Request status breakdown (PENDING / FULFILLED / CANCELLED counts)
    public List<RequestStatusSummaryDTO> getRequestsSummary() {

        Map<RequestStatus, Long> grouped = requestRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(BloodRequest::getStatus, Collectors.counting()));

        return grouped.entrySet()
                .stream()
                .map(e -> new RequestStatusSummaryDTO(e.getKey().name(), e.getValue()))
                .toList();
    }

    // Bags expiring within 3 days — reuses the same logic as /api/inventory/expiring
    public List<BloodInventoryResponseDTO> getExpiryAlerts() {
        return inventoryService.getExpiringSoon();
    }
}
