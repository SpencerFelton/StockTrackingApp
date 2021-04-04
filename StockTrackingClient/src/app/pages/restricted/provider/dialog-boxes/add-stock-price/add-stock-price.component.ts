import {Component, Inject, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanyService} from '../../../../../services/company.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'pm-addstockprice',
    templateUrl: './add-stock-price.component.html',
    styleUrls: ['./add-stock-price.component.css'],
})

export class AddStockPriceComponent implements OnInit{
    data:any;
    errorMessage:string;
    newPrice:number;
    AddStockPriceForm: FormGroup;
    newPriceMessage:string;
    addPrice = false;


    private validationMessagenewPrice = {
        required: "Please enter a new price"
      }

    constructor(private companyService: CompanyService, private formbuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddStockPriceComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.data = data;
                                }
    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
          this.AddStockPriceForm = this.formbuilder.group({
            currentStockPrice: { value: this.data.currentStockPrice, disabled: true },
            newStockPrice: ['', { validators: [Validators.required]}],
          });
    
    
        const stockPriceControl = this.AddStockPriceForm.get("newStockPrice");
        stockPriceControl.valueChanges.subscribe(
          value => {
            console.log(String(value));
            this.newPrice = value;
            this.setMessage(stockPriceControl)
          }
        )
      }


      setMessage(c: AbstractControl): void {
            this.newPriceMessage = '';
            console.log(`if Touched is ${c.touched}`);
            console.log(`if dirty is ${c.dirty}`);
            console.log(`if errors present is ${c.errors}`);
            if ((c.touched || c.dirty) && c.errors) {
              this.newPriceMessage = Object.keys(c.errors).map(
                key => this.validationMessagenewPrice[key]).join(' ');
            }
        }


    AddNewStockPrice():void{
        console.log(`id being sent: ${this.data.id}`);
        console.log(`price being sent: ${this.newPrice}`);
        this.companyService.addStockPrice(this.data.id, this.newPrice).subscribe({
                next: subscribedCompanies =>{
                    console.log("Added stock price!")
                    this.addPrice = true;
                    this.close();
                },
                error: err => {
                  this.errorMessage = err;
                  this.close();} 
            });
            
        this.close();
    }

    close(){
        this.dialogRef.close({id:this.data.id,value:this.newPrice, addPrice:this.addPrice});
    }
}