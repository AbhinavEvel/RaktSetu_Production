package com.raktsetu.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.raktsetu.backend.dto.BloodInventoryResponseDTO;
import com.raktsetu.backend.dto.MonthlyDonationDTO;
import com.raktsetu.backend.dto.RequestStatusSummaryDTO;
import com.raktsetu.backend.dto.StockSummaryDTO;
import com.raktsetu.backend.service.ReportService;
import com.raktsetu.backend.exception.BadRequestException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/stock-summary")
    public ResponseEntity<List<StockSummaryDTO>> getStockSummary(Authentication authentication) {
        requireAdmin(authentication);
        return ResponseEntity.ok(reportService.getStockSummary());
    }

    @GetMapping("/donations-monthly")
    public ResponseEntity<List<MonthlyDonationDTO>> getMonthlyDonations(Authentication authentication) {
        requireAdmin(authentication);
        return ResponseEntity.ok(reportService.getMonthlyDonations());
    }

    @GetMapping("/requests-summary")
    public ResponseEntity<List<RequestStatusSummaryDTO>> getRequestsSummary(Authentication authentication) {
        requireAdmin(authentication);
        return ResponseEntity.ok(reportService.getRequestsSummary());
    }

    @GetMapping("/expiry-alerts")
    public ResponseEntity<List<BloodInventoryResponseDTO>> getExpiryAlerts(Authentication authentication) {
        requireAdmin(authentication);
        return ResponseEntity.ok(reportService.getExpiryAlerts());
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
