import {Component, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';

@Component({
    selector: 'pm-accountbutton',
    templateUrl: './account-button.component.html',
    styleUrls: ['./account-button.component.css']
})

export class AccountButtonComponent implements OnInit{

    constructor(public auth: AuthService){}
    ngOnInit(): void {
        console.log("Hello!");
        console.log(this.auth.user$);
    }
}