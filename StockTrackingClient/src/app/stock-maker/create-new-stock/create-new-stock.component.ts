import {Component, Inject, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanyService} from 'src/app/shared/company-service/company.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'pm-updatestockname',
    templateUrl: './create-new-stock.component.html',
    //styleUrls: ['./add-stock-price.component.css'],
})

export class CreateNewStockComponent implements OnInit{
    data:any;
    errorMessage:string;
    newStockName:string;
    newStockAbbr:string;
    CreateNewStockForm: FormGroup;
    newStockNameMessage:string;
    newAbbrMessage:string;


    private validationMessageNewStockName = {
        required: "Please enter a stock name.",
        minLength: "The stock name must be more than 2 characters long"
    }
    
    private validationMessageNewAbbr = {
        required: "Please enter an abbreviation",
        maxLength: "The stock name must be less than 6 characters long"
    }



    constructor(private companyService: CompanyService, private formbuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateNewStockComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.data = data;
                                }
    ngOnInit(): void {
        this.generateForm();
    }
    //TODO- Figure out what the validators should be for stock abbreviation
    generateForm(): void {
          this.CreateNewStockForm = this.formbuilder.group({
            StockName: ['', { validators: [Validators.required, Validators.minLength(3)]}],
            StockAbbr: ['', { validators: [Validators.required, Validators.maxLength(6)]}],
          });

        const stockNameControl = this.CreateNewStockForm.get("StockName");
        stockNameControl.valueChanges.subscribe(
          value => {
            console.log(String(value));
            this.newStockName = value;
            this.setMessage(1,stockNameControl)
          }
        )
        const stockAbbrControl = this.CreateNewStockForm.get("StockAbbr");
        stockAbbrControl.valueChanges.subscribe(
          value => {
            console.log(String(value));
            this.newStockAbbr = value;
            this.setMessage(2,stockAbbrControl)
          }
        )
      }


      setMessage(type:number,c: AbstractControl): void {
          switch(type){
              case 1:           
                this.newStockNameMessage = '';
                console.log(`if Touched is ${c.touched}`);
                console.log(`if dirty is ${c.dirty}`);
                console.log(`if errors present is ${c.errors}`);
                if ((c.touched || c.dirty) && c.errors) {
                    this.newStockNameMessage = Object.keys(c.errors).map(
                    key => this.validationMessageNewStockName[key]).join(' ');
                    console.log("We are here!");
                    console.log(this.newStockNameMessage);
            }
                  break;
              case 2:
                this.newAbbrMessage = '';
                console.log(`if Touched is ${c.touched}`);
                console.log(`if dirty is ${c.dirty}`);
                console.log(`if errors present is ${c.errors}`);
                if ((c.touched || c.dirty) && c.errors) {
                    this.newAbbrMessage = Object.keys(c.errors).map(
                    key => this.validationMessageNewAbbr[key]).join(' ');
                    console.log("We are here!");
                    console.log(this.newAbbrMessage);
            }
                  break;     
          }
 
        }


    createNewStock():void{
        this.companyService.createNewStock(this.newStockName, this.newStockAbbr).subscribe({
                next: subscribedCompanies =>{
                    console.log("updated stock name!")
                },
                error: err => this.errorMessage = err 
            });
     
        this.close();
    }

    close(){
        this.dialogRef.close();
    }
}