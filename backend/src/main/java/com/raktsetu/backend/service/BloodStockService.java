package com.raktsetu.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.raktsetu.backend.entity.BloodStock;
import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.enums.Component;
import com.raktsetu.backend.repository.BloodStockRepository;
import com.raktsetu.backend.exception.ResourceNotFoundException;


@Service
public class BloodStockService {

    private final BloodStockRepository stockRepository;

    public BloodStockService(BloodStockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<BloodStock> getAllStock() {
        return stockRepository.findAll();
    }

    // Blood Request module isko call karega — stock available hai ya nahi check karne ke liye
    public boolean isStockAvailable(BloodGroup bg, Component comp, int unitsNeeded) {
        BloodStock stock = stockRepository.findByBloodGroupAndComponent(bg, comp)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record missing for " + bg + " - " + comp));
        return stock.getUnitsAvailable() >= unitsNeeded;
    }

    // Request fulfill hone pe stock se units minus karna
    public void deductStock(BloodGroup bg, Component comp, int units) {
        BloodStock stock = stockRepository.findByBloodGroupAndComponent(bg, comp)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record missing"));
        stock.setUnitsAvailable(stock.getUnitsAvailable() - units);
        stockRepository.save(stock);
    }

    // Donation hone pe stock mein units add karna
    public void addStock(BloodGroup bg, Component comp, int units) {
        BloodStock stock = stockRepository.findByBloodGroupAndComponent(bg, comp)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record missing"));
        stock.setUnitsAvailable(stock.getUnitsAvailable() + units);
        stockRepository.save(stock);
    }

    // Admin ke liye — low stock alert
    public List<BloodStock> getLowStock(int threshold) {
        return stockRepository.findByUnitsAvailableLessThan(threshold);
    }

    // Admin manually corrects the stock count for a blood group + component
    public BloodStock updateStock(BloodGroup bg, Component comp, int unitsAvailable) {
        BloodStock stock = stockRepository.findByBloodGroupAndComponent(bg, comp)
                .orElseThrow(() -> new ResourceNotFoundException("Stock record missing for " + bg + " - " + comp));
        stock.setUnitsAvailable(unitsAvailable);
        return stockRepository.save(stock);
    }
}
