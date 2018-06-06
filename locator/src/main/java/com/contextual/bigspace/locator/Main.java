package com.contextual.bigspace.locator;

import com.contextual.bigspace.locator.services.LocatorService;
import com.contextual.bigspace.locator.web.Locator;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.hk2.utilities.ServiceLocatorUtilities;
import org.glassfish.jersey.servlet.ServletContainer;

import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {

    public static void main(String[] args) throws Exception {

        Server server = new Server(7979);

       /* ServletContextHandler ctxHandler = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);

        ctxHandler.setContextPath("/");
        server.setHandler(ctxHandler);*/


        LocatorServerConfig config = new LocatorServerConfig();
        ServletHolder servletHolder = new ServletHolder( new ServletContainer( config));

        ServletContextHandler context = new ServletContextHandler(server, "/");
        context.addServlet( servletHolder, "/*");

        try {
            server.start();
            server.join();
        } catch (Exception ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } finally {

            server.destroy();
        }
    }
}
