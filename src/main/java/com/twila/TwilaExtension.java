package com.twila;

import com.tapestry.extensions.*;
import com.tapestry.lifecycle.TapestryPhase;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
            "TWILA - That's What I'm Looking At",
            "1.0.0",
            "1.0.0",
            List.of(
                new CapabilityDecl("client.overlay", CapabilityType.API, false, Map.of(), ""),
                new CapabilityDecl("client.raycast", CapabilityType.API, false, Map.of(), "")
            ),
            List.of(),
            List.of(),
            Optional.empty(),
            List.of()
        );
    }
    
    @Override
    public TapestryExtension create() {
        return new TapestryExtension() {
            @Override
            public TapestryExtensionDescriptor describe() {
                return new TapestryExtensionDescriptor(
                    "twila",
                    "TWILA - That's What I'm Looking At",
                    "1.0.0",
                    "1.0.0",
                    List.of(
                        new CapabilityDecl("client.overlay", CapabilityType.API, false, Map.of(), ""),
                        new CapabilityDecl("client.raycast", CapabilityType.API, false, Map.of(), "")
                    ),
                    List.of(),
                    List.of(),
                    Optional.empty(),
                    List.of()
                );
            }
            
            @Override
            public void register(TapestryExtensionContext ctx) throws ExtensionRegistrationException {
                // Register client-side capabilities
                // Note: Functions will be registered from TypeScript side
                ctx.log().info("TWILA extension registered");
            }
        };
    }
}
