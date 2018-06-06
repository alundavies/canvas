package com.contextual.bigspace.locator.values;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BurnResults {

    private Burn[] burns;

    @JsonProperty( "burns")
    public void setBurns( Burn[] burns){
        this.burns=burns;
    }

    public Burn[] getBurns(){
        return burns;
    }
}
