package com.contextual.bigspace.locator;

import org.glassfish.jersey.server.ResourceConfig;

public class LocatorServerConfig extends ResourceConfig {

    public LocatorServerConfig(){
        register( new LocatorServerBinder());
        packages( true, "com.contextual.bigspace.locator");
    }
}
