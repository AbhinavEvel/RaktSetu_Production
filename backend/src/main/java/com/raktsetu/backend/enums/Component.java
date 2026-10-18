package com.raktsetu.backend.enums;

public enum Component {

    WHOLE_BLOOD(35),
    RBC(42),
    PLASMA(365),
    PLATELETS(5);

    private final int shelfLifeDays;

    Component(int shelfLifeDays) {
        this.shelfLifeDays = shelfLifeDays;
    }

    public int getShelfLifeDays() {
        return shelfLifeDays;
    }
}
