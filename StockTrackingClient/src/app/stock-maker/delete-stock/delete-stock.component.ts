import {Component, Inject, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanyService} from 'src/app/shared/company-service/company.service';

@Component({
    selector: 'pm-deletestock',
    templateUrl: './delete-stock.component.html',
    //styleUrls: ['./add-stock-price.component.css'],
})

export class DeleteStockComponent implements OnInit{
    data:any;
    errorMessage:string;
    delete = false;



    constructor(private companyService: CompanyService,
        public dialogRef: MatDialogRef<DeleteStockComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.data = data;
                                }
    ngOnInit(): void {
    }


    deleteStock():void{
        this.companyService.deleteCompany(this.data.id).subscribe({
                next: subscribedCompanies =>{
                    console.log("Deleted stock!");
                    this.delete = true;
                    this.close();
                },
                error: err => {
                    this.errorMessage = err;
                    this.close();
                } 
            });
        
        
    }

    close(){
        this.dialogRef.close({id:this.data.id,delete:this.delete});
    }
}