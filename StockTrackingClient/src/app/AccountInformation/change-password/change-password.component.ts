import {Component, Inject, Input, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AccountService} from 'src/app/shared/Account-service/account-service.component';

@Component({
    selector: 'pm-changepassword',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
})

export class ChangePasswordComponent implements OnInit{
    userId:string;
    email:string;
    //data:any;
    errorMessage:string;
    delete = false;



    constructor(private accountService: AccountService,
        public dialogRef: MatDialogRef<ChangePasswordComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.userId = data.userId;
                                    this.email = data.email;
                                    console.log(this.email);
                                }
    ngOnInit(): void {
    }


    changePassword(email:string):void{
        this.accountService.changePassword(email).subscribe(
            next =>{
                console.log("Sent confirmation email!");
        })
        //console.log("This is not properly implemented yet!");
    }

    close(){
        this.dialogRef.close();
    }
}