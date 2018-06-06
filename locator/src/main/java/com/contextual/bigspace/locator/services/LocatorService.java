package com.contextual.bigspace.locator.services;

import com.contextual.bigspace.locator.values.BigSpaceItem;
import com.contextual.bigspace.locator.values.Burn;
import com.contextual.bigspace.locator.values.BurnResults;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jvnet.hk2.annotations.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

@Service
public class LocatorService {

    private Logger logger = Logger.getLogger(LocatorService.class.getName());
    private HashMap<String, BurnResults> layerBurns = new HashMap(100);
    private String layersDirectory;
    private String layerName;


    public LocatorService(String layersDirectory, String layerName) {
        this.layersDirectory = layersDirectory;
        this.layerName = layerName;
    }


    public void start() {
        logger.info("Starting Locator Service");
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this::refresh, 0, 30, TimeUnit.SECONDS);
    }


    public BigSpaceItem find(BigDecimal x, BigDecimal y, String layerName) throws IOException {

        BurnResults burnResults = layerBurns.get(layerName);

        for (Burn burn : burnResults.getBurns()) {
            logger.info(burn.toString());
            BigSpaceItem item = burn.getBigSpaceItem();
            if (item.getBottom().compareTo(y) > 0 && item.getTop().compareTo(y) < 0 &&
                    item.getRight().compareTo(x) > 0 && item.getLeft().compareTo(x) < 0) {
                return item;
            }
        }

        return null;

    }

    public void refresh() {

        logger.info("Refreshing data");

        try {
            ObjectMapper mapper = new ObjectMapper();
            BurnResults result = mapper.readValue(Paths.get(this.layersDirectory, layerName, "burns.json").toFile(), BurnResults.class);
            layerBurns.put(layerName, result);
        } catch (IOException ioe) {
            logger.warning(String.format("Could not read burn data for layer %s", layerName));
        }

    }

}
