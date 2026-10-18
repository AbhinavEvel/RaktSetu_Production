package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.BloodInventoryRequestDTO;
import com.raktsetu.backend.dto.BloodInventoryResponseDTO;
import com.raktsetu.backend.dto.InventoryStatusUpdateDTO;
import com.raktsetu.backend.service.BloodInventoryService;
import com.raktsetu.backend.exception.BadRequestException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
public class BloodInventoryController {

    private final BloodInventoryService inventoryService;

    public BloodInventoryController(BloodInventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/add")
    public ResponseEntity<BloodInventoryResponseDTO> addBag(
            @RequestBody BloodInventoryRequestDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);

        String adminEmail = authentication.getName();
        BloodInventoryResponseDTO response = inventoryService.addBag(dto, adminEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BloodInventoryResponseDTO>> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<BloodInventoryResponseDTO>> getExpiring() {
        return ResponseEntity.ok(inventoryService.getExpiringSoon());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BloodInventoryResponseDTO> updateBag(
            @PathVariable Long id,
            @RequestBody BloodInventoryRequestDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(inventoryService.updateBag(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBag(@PathVariable Long id, Authentication authentication) {
        requireAdmin(authentication);

        inventoryService.deleteBag(id);
        return ResponseEntity.noContent().build();
    }

    // Admin — mark a specific bag as used/expired/available again
    @PutMapping("/status/{id}")
    public ResponseEntity<BloodInventoryResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody InventoryStatusUpdateDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(inventoryService.updateStatus(id, dto.getStatus()));
    }

    private void requireAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_Admin"));

        if (!isAdmin) {
            throw new BadRequestException("Access denied: Admins only");
        }
    }
}
