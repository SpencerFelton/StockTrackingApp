import {Component, Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanyServiceClient} from 'src/app/shared/company-service-client/company-service-client';

@Component({
    selector: 'pm-subscribedialog',
    templateUrl: './subscribe-unsubscribe.component.html',
    styleUrls: ['./subscribe-unsubscribe.component.css'],
})

export class SubscribeUnsubscribeComponent{
    data:any;
    errorMessage:string;

    constructor(private companyService: CompanyServiceClient,
        public dialogRef: MatDialogRef<SubscribeUnsubscribeComponent>,
                                @Inject(MAT_DIALOG_DATA) data) 
                                { 
                                    this.data = data;
                                }


    subUnsub():void{
        console.log("60");
        if(this.data.subbed){
            this.companyService.unsubscribeToStock(this.data.id).subscribe({
                next: subscribedCompanies =>{
                    console.log("Get data")
                },
                error: err => this.errorMessage = err 
            });
        }else{
            this.companyService.subscribeToStock(this.data.id).subscribe({
                next: subscribedCompanies =>{
                    console.log("I am here!(x100)")
                },
                error: err => this.errorMessage = err 
            });

        }
        this.close();
    }

    close(){
        this.dialogRef.close();
    }


}