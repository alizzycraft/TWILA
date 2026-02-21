package com.twila;

import net.fabricmc.api.ModInitializer;

/**
 * Basic TWILA test with main entrypoint
 */
public class MinimalExtension implements ModInitializer {
    
    @Override
    public void onInitialize() {
        System.out.println("=== TWILA MINIMAL: MAIN ENTRYPOINT CALLED ===");
        System.err.println("=== TWILA MINIMAL: MAIN ENTRYPOINT CALLED ===");
    }
}
