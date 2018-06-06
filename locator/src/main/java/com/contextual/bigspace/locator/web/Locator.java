package com.contextual.bigspace.locator.web;

import com.contextual.bigspace.locator.services.LocatorService;
import com.contextual.bigspace.locator.values.BigSpaceItem;


import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.math.BigDecimal;

@Path("locator")
public class Locator {

    @Inject
    @SuppressWarnings("unused")
    private LocatorService locatorService;

    public Locator(){}

    // simple web-service to return document details at a given layer and map co-ordinate
    @GET
    @Path( "items")
    @Produces(MediaType.APPLICATION_JSON)
    public BigSpaceItem getItemAt( @QueryParam("x") String x, @QueryParam("y") String y, @QueryParam("layer") String layer) throws Exception {

        BigSpaceItem item = locatorService.find( new BigDecimal( x), new BigDecimal( y), layer);

       /* if( item==null){
            throw new NotFoundException();
        }*/
        //BigSpaceItem item = new BigSpaceItem( "test", new BigDecimal("0.3"), new BigDecimal("0.3"), new BigDecimal("0.2"), new BigDecimal("0.4"), layer);
        return item;
    }

    @GET
    @Path( "test")
    @Produces(MediaType.APPLICATION_JSON)
    public String test(){
        return "test done";
    }
}
