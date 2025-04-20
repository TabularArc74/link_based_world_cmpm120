class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        //console.log(key);
        let locationData = this.engine.storyData.Locations[key]; 
        this.engine.show(locationData.Body);

        //For testing:
        //this.engine.storyData.HasMap = true;

        /*if(locationData.KeyText != null && this.engine.storyData.HasKey == true){
            //this.engine.show(locationData.KeyText);
            //Display button for prompt
            this.engine.addChoice(locationData.KeyText);
        }*/
        
        if(locationData.Choices != null) { 
            this.placeButtons(locationData);
        } else {
            this.engine.addChoice("The end.")
        }

        if(locationData.Log != null){
            this.engine.addLog(locationData);
        }

        if(this.engine.storyData.HasMap == true){
            this.engine.addMap(locationData);
        }
    }

    handleChoice(choice) {
        if(choice) {
            if(choice.Target == "NavMechanic"){
                this.engine.gotoScene(Nav);
            }else if(choice.Target == "Lab"){
                this.engine.storyData.HasKey = true;
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }else if(choice.Target == "Bridge" && this.engine.storyData.HasKey == false){
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, "Denied");
            }else{
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }

    displayLog(loc, data, displayString){
        //display the text from the log in the current location
        this.engine.show(displayString);
        this.engine.show(data);
        this.placeButtons(loc);
    }

    placeButtons(locationData){
        for(let choice of locationData.Choices) { 
            this.engine.addChoice(choice.Text, choice); 
        }
    }
}

class Nav extends Scene {
//framework for interactable scene element
    create() {
        let data = this.engine.storyData.Locations.NavMechanic;
        if(this.engine.storyData.HasMap == false){
            this.engine.show(data.Body);
            this.engine.addChoice(data.Button);
        }else{
            this.engine.show("You have already downloaded the map data");
            this.engine.addChoice("Go back");
        }
    }

    handleChoice() {
        this.engine.storyData.HasMap = true;
        this.engine.gotoScene(Location, "Navigation");
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');