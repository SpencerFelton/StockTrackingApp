/*
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NotifierService } from '../shared/Notifications/notifier.service';
import { InputType } from './InputEnumStock';


import { ICompany } from '../shared/company-models/company';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../shared/company-service/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-stock-modify',
  templateUrl: './stock-modify.component.html',
  styleUrls: ['./stock-modify.component.css']
})

export class StockModify implements OnInit, OnChanges {
  pageTitle: string = "Modify Stock";
  company: ICompany;
  companyid: number;
  errorMessage: string;
  CompanyName: string;
  CompanyStock: number;
  CompanyShorthand: string;
  isZero: boolean = false;
  ModifyStockForm: FormGroup;
  companyNameMessage: string;
  companyShorthandMessage: string;
  stockPriceMessage: string;
  formGenerated: boolean = false;

  private validationMessagesCompanyName = {
    required: "Please enter your company name.",
    minlength: "The company name has to be greater than 3."
  }
  private validationMessagesCompanyShorthand = {
    required: "Please enter the company abbreviation.",
    minlength: "The company abbreviation has to be greater than 3.",
    maxlength: "The company abbreviation has to be less than 6."
  }

  private validationMessagesStockPrice = {
    required: "Please select a valid stock price."
  }




  constructor(private route: ActivatedRoute, private companyService: CompanyService, private router: Router, private NotifierService: NotifierService, private formbuilder: FormBuilder) { }




  ngOnInit() {
    let companyid = +this.route.snapshot.paramMap.get('id');
    if (companyid == 0) {
      this.isZero = true;
    } else {
      this.isZero = false;
    }
    this.pageTitle += `: ${companyid}`;
    this.getCompany(companyid);
    console.log('this is the company id:' + companyid);
  }

  generateForm(company: any): void {
    console.log(`the stock id is ${company.stock_id}`);
    if (company.stock_id == null) {
      this.ModifyStockForm = this.formbuilder.group({
        companyName: ['', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }],
        companyShorthand: ['', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(5)], updateOn: 'blur' }],
        stockPrice: ['', { validators: [Validators.required], updateOn: 'blur' }]
      });
    }
    else {
      this.ModifyStockForm = this.formbuilder.group({
        companyName: [company.name, { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }],
        companyShorthand: [{ value: company.abbreviation, disabled: true }],
        stockPrice: [company.price, { validators: [Validators.required] }]
      });
    }


    const companyNameControl = this.ModifyStockForm.get("companyName");
    companyNameControl.valueChanges.subscribe(
      value => {
        console.log(String(value));
        this.setMessage(InputType.CompanyName, companyNameControl)
      }
    )

    const companyShorthandControl = this.ModifyStockForm.get('companyShorthand');
    companyShorthandControl.valueChanges.subscribe(
      value => {
        console.log(String("connected to companyShorthand"));
        this.setMessage(InputType.CompanyShorthand, companyShorthandControl)
      }
    )

    const stockPriceControl = this.ModifyStockForm.get('stockPrice');
    stockPriceControl.valueChanges.subscribe(
      value => {
        console.log(String("connected to stockPrice"));
        console.log("Stock price is ");
        console.log(value);
        this.CompanyStock = value;
        this.setMessage(InputType.StockPrice, stockPriceControl)
      }
    )
    this.formGenerated = true;
  }


  setMessage(input: InputType, c: AbstractControl): void {
    console.log("Input = " + input);
    switch (+input) {
      case InputType.CompanyName:
        console.log("I am here!");
        this.companyNameMessage = '';
        console.log(`if Touched is ${c.touched}`);
        console.log(`if dirty is ${c.dirty}`);
        console.log(`if errors present is ${c.errors}`);
        if ((c.touched || c.dirty) && c.errors) {
          this.companyNameMessage = Object.keys(c.errors).map(
            key => this.validationMessagesCompanyName[key]).join(' ');
        }
        break;
      case InputType.CompanyShorthand:
        this.companyShorthandMessage = '';
        console.log(`if Touched is ${c.touched}`);
        console.log(`if dirty is ${c.dirty}`);
        console.log(`if errors present is ${c.errors}`);
        if ((c.touched && c.dirty) && c.errors) {
          this.companyShorthandMessage = Object.keys(c.errors).map(
            key => this.validationMessagesCompanyShorthand[key]).join(' ');
        }
        break;
      case InputType.StockPrice:
        console.log(`Touched: ${c.touched}, Dirty: ${c.dirty}, Pristine: ${c.valid}`);
        this.stockPriceMessage = '';
        if (c.errors) {
          this.stockPriceMessage = Object.keys(c.errors).map(
            key => this.validationMessagesStockPrice[key]).join(' ');
        }
        break;
    }
  }

  getCompany(id: number): void {
    if (id != 0) {
      this.companyService.getCompany(id)
        .subscribe({
          next: (company: any) => {
            this.company = company;
            this.displayCompany(company);
            this.generateForm(company);
          },
          error: err => this.errorMessage = err
        })
    } else {
      this.company = this.companyService.initialiseCompany();
      this.displayCompany(this.company);
      this.generateForm(this.company);
    }
    console.log(this.company.name);

  }

  displayCompany(company: ICompany): void {
    this.CompanyName = company.name;
    console.log(this.CompanyName);
    this.CompanyStock = company.price;
    console.log(this.CompanyStock);
    this.CompanyShorthand = company.abbreviation;
    console.log(this.CompanyShorthand);
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  save(): void {
    if (!this.isZero) {
      //save the data and update the form
      console.log("began saving")
      if (this.CompanyName != this.company.name) {
        this.company.name = this.CompanyName;
      }
      this.company.price = this.CompanyStock;
      this.companyService.modifyCompany(this.company)
        .subscribe({
          next: () => {
            this.getCompany(this.companyid);
            console.log("Sucessfully saved!");
            this.NotifierService.showNotification("Company sucessfully modified and saved!", "OK", "success", "upload");
          },
          error: () => {
            err => this.errorMessage = err;
            this.NotifierService.showNotification("Error: There was a problem saving these changes", "OK", "error", "cross");
          }
        });
    } else {
      console.log("began saving")
      this.company.name = this.CompanyName;
      this.company.price = this.CompanyStock;
      this.company.abbreviation = this.CompanyShorthand;
      this.companyService.addCompanyNoPrice(this.company.name,this.company.abbreviation)
        .subscribe({
          next: () => {
            console.log("Sucessfully saved new stock!");
            this.NotifierService.showNotification("Company sucessfully added and uploaded!", "OK", "success", "upload");
            //this.NotifierService.showNotification("Company sucessfully modified and saved!", "OK","success","upload");
            this.router.navigate(['/stockmaker']);
          },
          error: () => {
            err => this.errorMessage = err;
            this.NotifierService.showNotification("Error: There was a problem saving these changes", "OK", "error", "cross");
          }
        })

      this.companyService.addStockPrice(this.company.id, this.company.price)
        .subscribe({
          next: () => {
            console.log("Sucessfully added stock price!");
            this.NotifierService.showNotification("Company stock updated!", "OK", "success", "upload");
            //this.NotifierService.showNotification("Company sucessfully modified and saved!", "OK","success","upload");
            this.router.navigate(['/stockmaker']);
          },
          error: () => {
            err => this.errorMessage = err;
            this.NotifierService.showNotification("Error: There was a problem saving these changes", "OK", "error", "cross");
          }

        })
    }

  }
  onDelete(): void {
    if (confirm(`Are you sure you want to delete the company ${this.company.abbreviation} (${this.company.name}) and all it's related stocks and data? (WARNING: THIS ACTION CANNOT BE UNDONE)`)) {
      this.companyService.deleteCompany(this.company.id)
        .subscribe({
          next: () => this.router.navigate(['/stockmaker']),
          error: err => this.errorMessage = err
        });
    }
  }

}
*/
