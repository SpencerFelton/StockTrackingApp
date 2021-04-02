import { Component,  OnInit } from "@angular/core";
import {AuthService} from '@auth0/auth0-angular';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ChangePasswordComponent} from './change-password/change-password.component';
import {DeleteAccountComponent} from './delete-account/delete-account.component';

export interface AccountInformation{
    AccountParameter: string;
    AssociatedData: string;
}


const ACCOUNT_DATA: AccountInformation[] = [
    {AccountParameter:"Account Type", AssociatedData: "", },
    {AccountParameter:"Username", AssociatedData:''},
    {AccountParameter:"Password", AssociatedData: "*****"},
    {AccountParameter:"First Name", AssociatedData: ""},
    {AccountParameter:"Last Name", AssociatedData: ""},
    {AccountParameter:"Email Address", AssociatedData: ""},
];

@Component({
    selector: 'pm-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']

})

export class AccountViewComponent{
    userId:string;
    username:string;
    email:string;
    accountType:string;
    data:any;
    displayedColumns: string[] = ['parameter', 'userData'];
    accountdata = ACCOUNT_DATA;
    dataSource:any;

    constructor(public auth: AuthService,
                private dialog:MatDialog){

        var results = auth.user$.subscribe(
            next =>{
                console.log(next);
                console.log(next["https://mynamespace/account_type"]);
                console.log(next["https://mynamespace/first_name"]);
                console.log(next["https://mynamespace/last_name"]);
                console.log(next["https://mynamespace/email"]);
                console.log(next.sub);
                this.generateTable(next);
                //console.log(next.["https://mynamespace/first_name"]);
            }
        );

        
    }

    generateTable(values:any){
        //get account type: TODO: MAKE THIS ASSOCIATED WITH ROLES INSTEAD
        if(values["https://mynamespace/account_type"] == "pr" ){
           this.accountdata[0].AssociatedData =  "Provider";
        }else{
            this.accountdata[0].AssociatedData =  "Client";
        }
        
        this.accountdata[1].AssociatedData = values["https://mynamespace/username"];
        this.username = this.accountdata[1].AssociatedData;
        this.accountdata[3].AssociatedData =  values["https://mynamespace/first_name"];
        this.accountdata[4].AssociatedData =  values["https://mynamespace/last_name"];
        this.accountdata[5].AssociatedData =  values["email"];
        this.email = values["email"];
        this.userId = values["sub"];
        this.dataSource = this.accountdata; 
    }

    openChangePasswordDialog(userid:string, email:string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            userId:userid,
            email:email,
        };

        const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);
        
    }

    openDeleteAccountDialog(userid:string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            userId:userid,
        };

        const dialogRef = this.dialog.open(DeleteAccountComponent, dialogConfig);
        
    }
    
        
}