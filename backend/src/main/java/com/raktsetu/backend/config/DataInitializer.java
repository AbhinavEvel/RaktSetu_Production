package com.raktsetu.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.raktsetu.backend.entity.BloodStock;
import com.raktsetu.backend.enums.BloodGroup;
import com.raktsetu.backend.repository.BloodStockRepository;


@Component
public class DataInitializer implements CommandLineRunner {

    private final BloodStockRepository bloodStockRepository;

    public DataInitializer(BloodStockRepository bloodStockRepository) {
        this.bloodStockRepository = bloodStockRepository;
    }

    @Override
    public void run(String... args) {
        for (BloodGroup bg : BloodGroup.values()) {
            for (com.raktsetu.backend.enums.Component comp : com.raktsetu.backend.enums.Component.values()) {
                boolean exists = bloodStockRepository
                        .findByBloodGroupAndComponent(bg, comp).isPresent();
                if (!exists) {
                    BloodStock stock = new BloodStock();
                    stock.setBloodGroup(bg);
                    stock.setComponent(comp);
                    stock.setUnitsAvailable(0);
                    bloodStockRepository.save(stock);
                }
            }
        }
        System.out.println("✅ Blood Stock table initialized with 32 rows (if not already present)");
    }
}
