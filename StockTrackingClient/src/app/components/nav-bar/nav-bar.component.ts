import { Component } from "@angular/core";

@Component({
    selector: 'navbar',
    templateUrl: './nav-bar.component.html',
    styleUrls:['./nav-bar.component.scss']
})

export class NavBarComponent {

    isCurrentlyNotOpen:boolean = true;

    constructor(){
    }

    OnMenuClicked(){
        this.isCurrentlyNotOpen = !this.isCurrentlyNotOpen;
    }
    
}