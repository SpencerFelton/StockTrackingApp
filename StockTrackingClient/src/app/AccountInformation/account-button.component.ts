import {Component, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';

@Component({
    selector: 'pm-accountbutton',
    templateUrl: './account-button.component.html',
    styleUrls: ['./account-button.component.css']
})

export class AccountButtonComponent{

    username:string;
    email:string;
    AccountType:string;
    firstName:string;
    lastName:string;

    constructor(public auth: AuthService){
        var results = auth.user$.subscribe(
            next =>{
                this.generateButton(next);
                //console.log(next.["https://mynamespace/first_name"]);
            }
        );

    }

    generateButton(values:any){
        if(values["https://mynamespace/account_type"] == "pr" ){
            this.AccountType =  "Provider";
         }else{
             this.AccountType =  "Client";
         }

         this.firstName =  values["https://mynamespace/first_name"];
         this.lastName=  values["https://mynamespace/last_name"];
         
         this.username =  values["https://mynamespace/username"];
         this.email =  values["email"];
    }
}