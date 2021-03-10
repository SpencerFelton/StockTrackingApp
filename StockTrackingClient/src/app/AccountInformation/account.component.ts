import { Component,  OnInit } from "@angular/core";
import {AuthService} from '@auth0/auth0-angular';

export interface AccountInformation{
    AccountParameter: string;
    AssociatedData: string;
}


const ACCOUNT_DATA: AccountInformation[] = [
    {AccountParameter:"Account Type", AssociatedData: "Admin"},
    {AccountParameter:"Username", AssociatedData: "Users Username"},
    {AccountParameter:"Password", AssociatedData: "*****"},
    {AccountParameter:"First Name", AssociatedData: "John"},
    {AccountParameter:"Last Name", AssociatedData: "Doe"},
    {AccountParameter:"Email Address", AssociatedData: "JD@Gmail.com"},
];

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
    displayedColumns: string[] = ['parameter', 'userData'];
    dataSource = ACCOUNT_DATA;

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