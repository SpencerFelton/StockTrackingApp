import {Component, Inject, Input, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AccountService} from '../../../../../../services/account-service.component';

@Component({
    selector: 'pm-deleteaccount',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.css'],
})

export class DeleteAccountComponent implements OnInit{
    userId:string;
    data:any;
    errorMessage:string;
    delete = false;



    constructor(private accountService: AccountService,
        public dialogRef: MatDialogRef<DeleteAccountComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.userId = data.userId;
                                    console.log(this.userId);
                                }
    ngOnInit(): void {
    }


    deleteAccount():void{
        console.log("This is not properly implemented yet!");
        
    }

    close(){
        this.dialogRef.close();
    }
}