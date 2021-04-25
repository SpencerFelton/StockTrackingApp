import { Component } from "@angular/core";

@Component({
    selector: 'navbar',
    templateUrl: './nav-bar.component.html'
})

export class NavBarComponent {

    isCurrentlyOpen:boolean = false;

    constructor(){}

    OnMenuClicked(){
        this.isCurrentlyOpen = !this.isCurrentlyOpen;
    }
    
}