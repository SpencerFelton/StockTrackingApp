import {Component, Inject, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanyService} from 'src/app/shared/company-service/company.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'pm-updatestockname',
    templateUrl: './update-stock-name.component.html',
    //styleUrls: ['./add-stock-price.component.css'],
})

export class UpdateStockNameComponent implements OnInit{
    data:any;
    errorMessage:string;
    newStockName:number;
    UpdateStockNameForm: FormGroup;
    newStockNameMessage:string;


    private validationMessageNewStockName = {
        required: "Please enter a stock name.",
        min: "The stock name must be more than3 characters long"
      }

    constructor(private companyService: CompanyService, private formbuilder: FormBuilder,
        public dialogRef: MatDialogRef<UpdateStockNameComponent>,
                                @Inject(MAT_DIALOG_DATA) data)    
                                { 
                                    this.data = data;
                                }
    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
          this.UpdateStockNameForm = this.formbuilder.group({
            currentStockName: { value: this.data.currentStockName, disabled: true },
            newStockName: ['', { validators: [Validators.required, Validators.min(3)]}],
          });
    
    
        const stockPriceControl = this.UpdateStockNameForm.get("newStockName");
        stockPriceControl.valueChanges.subscribe(
          value => {
            console.log(String(value));
            this.newStockName = value;
            this.setMessage(stockPriceControl)
          }
        )
      }


      setMessage(c: AbstractControl): void {
            this.newStockNameMessage = '';
            console.log(`if Touched is ${c.touched}`);
            console.log(`if dirty is ${c.dirty}`);
            console.log(`if errors present is ${c.errors}`);
            if ((c.touched || c.dirty) && c.errors) {
              this.newStockNameMessage = Object.keys(c.errors).map(
                key => this.validationMessageNewStockName[key]).join(' ');
            }
        }


    UpdateStockName():void{
        this.companyService.updateStockName();
        /*
        .subscribe({
                next: subscribedCompanies =>{
                    console.log("updated stock name!")
                },
                error: err => this.errorMessage = err 
            });

            */
            
        this.close();
    }

    close(){
        this.dialogRef.close();
    }
}