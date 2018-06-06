package com.contextual.bigspace.locator.values;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

@JsonIgnoreProperties({ "tileRange" })
public class Burn {

    private BigSpaceItem bigSpaceItem;

    public Burn(){}

    @JsonProperty( "itemLocation")
    @SuppressWarnings("unused")
    public void setBigSpaceItem( BigSpaceItem bigSpaceItem){
        this.bigSpaceItem = bigSpaceItem;
    }

    @SuppressWarnings("unused")
    public BigSpaceItem getBigSpaceItem(){
        return this.bigSpaceItem;
    }

    public String toString(){
        return Objects.toString( bigSpaceItem);
    }

}
