import { Component,  OnInit } from "@angular/core";
import {AuthService} from '@auth0/auth0-angular';


@Component({
    selector: 'pm-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']

})

export class AccountViewComponent{

    username:string;
    email:string;
    accountType:string;
    data:any;

    constructor(public auth: AuthService){
        /*
        if(auth.user$ ){
            //this.username = auth.user$.username;
            this.data = user.email;
            console.log(this.data);
        }
        */
    }
}