package com.twila;

import com.tapestry.extensions.*;
import com.tapestry.lifecycle.TapestryPhase;
import java.util.List;

/**
 * TWILA Tapestry Extension
 * 
 * Registers client-side capabilities for block identification overlay.
 */
public class TwilaExtension implements TapestryExtensionProvider {
    
    @Override
    public TapestryExtensionDescriptor describe() {
        return new TapestryExtensionDescriptor(
            "twila",
            List.of("client.overlay", "client.raycast")
        );
    }
    
    @Override
    public void register(TapestryExtensionContext ctx) {
        // Register client-side capabilities
        ctx.registerCapability("client.overlay");
        ctx.registerCapability("client.raycast");
    }
}
