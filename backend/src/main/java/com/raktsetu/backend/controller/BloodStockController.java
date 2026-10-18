package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raktsetu.backend.entity.BloodStock;
import com.raktsetu.backend.dto.StockUpdateDTO;
import com.raktsetu.backend.service.BloodStockService;

import jakarta.validation.Valid;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/stock")
public class BloodStockController {

    private final BloodStockService stockService;

    public BloodStockController(BloodStockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<BloodStock>> getAllStock() {
        return ResponseEntity.ok(stockService.getAllStock());
    }

    // Admin manually corrects stock units for a blood group + component
    @PutMapping("/update")
    public ResponseEntity<BloodStock> updateStock(
            @Valid @RequestBody StockUpdateDTO dto,
            Authentication authentication) {

        requireAdmin(authentication);

        BloodStock updated = stockService.updateStock(
                dto.getBloodGroup(), dto.getComponent(), dto.getUnitsAvailable());

        return ResponseEntity.ok(updated);
    }

    // Admin — blood group + component combinations running low (default threshold: 5 units)
    @GetMapping("/low")
    public ResponseEntity<List<BloodStock>> getLowStock(
            @RequestParam(defaultValue = "5") int threshold,
            Authentication authentication) {

        requireAdmin(authentication);
        return ResponseEntity.ok(stockService.getLowStock(threshold));
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
