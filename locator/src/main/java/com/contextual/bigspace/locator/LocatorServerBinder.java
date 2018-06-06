package com.contextual.bigspace.locator;

import com.contextual.bigspace.locator.services.LocatorService;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.hk2.utilities.ServiceLocatorUtilities;
import org.glassfish.hk2.utilities.binding.AbstractBinder;

public class LocatorServerBinder extends AbstractBinder {
    @Override
    protected void configure() {
        LocatorService locatorService = new LocatorService( "/Users/alundavies/tiles/layers", "code");
        locatorService.start();
        bind( locatorService).to( LocatorService.class);
    }

}
