package com.contextual.bigspace.locator.values;


import com.fasterxml.jackson.annotation.JsonAutoDetect;

import java.math.BigDecimal;


public class BigSpaceItem {

    private String itemId;
    private BigDecimal top;
    private BigDecimal left;
    private BigDecimal bottom;
    private BigDecimal right;
    private BigDecimal imageWidth;
    private BigDecimal imageHeight;
    private BigDecimal imageScaleFactor;
    private String layerName;

    public BigSpaceItem( String itemId, BigDecimal top, BigDecimal left, BigDecimal bottom, BigDecimal right, BigDecimal imageWidth, BigDecimal imageHeight, BigDecimal imageScaleFactor, String layerName) {
        this.itemId = itemId;
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.imageScaleFactor = imageScaleFactor;
        this.layerName = layerName;
    }

    public BigSpaceItem() {
        this( "EMPTY", new BigDecimal("0"),new BigDecimal("0"),
                new BigDecimal("0"), new BigDecimal("0"),
                new BigDecimal("0"), new BigDecimal("0"), new BigDecimal("0"), "none");
    }


    public String getItemId(){
        return this.itemId;
    }

    //@com.fasterxml.jackson.annotation.JsonProperty( "renameFieldHere")
    public BigDecimal getTop() {
        return top;
    }

    public BigDecimal getLeft() {
        return left;
    }

    public BigDecimal getBottom() {
        return bottom;
    }

    public BigDecimal getRight() {
        return right;
    }

    public String getLayerName() {
        return layerName;
    }

    public BigDecimal getImageWidth() {
        return imageWidth;
    }

    public BigDecimal getImageHeight() {
        return imageHeight;
    }

    public BigDecimal getImageScaleFactor(){
        return imageScaleFactor;
    }

    public String toBigDecimal(){
        return String.format( "itemId: %s  top: %s  left: %s  bottom: %s  right: %s  imageWidth: %s  imageHeight: %s  imageScaleFactor: %s", itemId, top, left, bottom, right, imageWidth, imageHeight, imageScaleFactor);
    }
}
