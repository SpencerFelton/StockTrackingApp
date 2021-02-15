import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NotifierService} from '../shared/Notifications/notifier.service';


import{ICompany} from '../shared/company-models/company';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../shared/company-service/company.service';
import {Router} from '@angular/router';

@Component({
    selector: 'pm-stock-modify',
    templateUrl: './stock-modify.component.html',
    styleUrls: ['./stock-modify.component.css']
})

export class StockModify implements OnInit, OnChanges{
    pageTitle: string = "Modify Stock";
    company: ICompany;
    companyid: number;
    errorMessage: string;
    companyName: string;
    companyStock: number;
    companyShortHand: string;
    isZero: boolean = false;;


    constructor(private route: ActivatedRoute, private companyService: CompanyService, private router: Router, private NotifierService:NotifierService){}

    
    ngOnInit(){
        let companyid =+this.route.snapshot.paramMap.get('id');
        if(companyid == 0){
            this.isZero = true;
        }else{
            this.isZero = false;
        }
        this.pageTitle += `: ${companyid}`;
        this.getCompany(companyid);  
        console.log('this is the company id:' + companyid);  
    } 

    getCompany(id: number): void{
        if(id != 0){
            this.companyService.getCompany(id)
            .subscribe({
            next: (company: any) => {
                this.company = company;
                this.displayCompany(company); },
                error: err => this.errorMessage = err
        })
        }else{
            this.company = this.companyService.initialiseCompany();
            this.displayCompany(this.company);
        }
        console.log(this.company.name);

    }

    displayCompany(company: ICompany): void{
        this.companyName = company.name;
        this.companyStock = company.price;
        this.companyShortHand = company.abbreviation;
    }
    ngOnChanges(changes: SimpleChanges): void {
    }

    onSave(): void{
        if(!this.isZero){
                    //save the data and update the form
        console.log("began saving")
        if(this.companyName != this.company.name){
            this.company.name = this.companyName;
        }
        this.company.price = this.companyStock;
        this.companyService.modifyCompany(this.company)
        .subscribe({
            next: () => {
                this.getCompany(this.companyid);
                console.log("Sucessfully saved!");
                this.NotifierService.showNotification("Company sucessfully modified and saved!", "OK","success","upload");},
            error: () =>{
                err => this.errorMessage = err;
                this.NotifierService.showNotification("Error: There was a problem saving these changes", "OK","error","cross");
            } 
        });
        }else{
            console.log("began saving")
            this.company.name = this.companyName;
            this.company.price = this.companyStock;
            this.company.abbreviation = this.companyShortHand;
            this.companyService.addCompany(this.company)
            .subscribe({
                next: () => {
                    console.log("Sucessfully saved!");
                    this.NotifierService.showNotification("Company sucessfully added and uploaded!", "OK","success","upload");
                    this.NotifierService.showNotification("Company sucessfully modified and saved!", "OK","success","upload");
                    this.router.navigate(['/stockmaker']);
                },
                error: () =>{
                    err => this.errorMessage = err;
                    this.NotifierService.showNotification("Error: There was a problem saving these changes", "OK","error","cross");
                } 
        })
    }

    }
    onDelete(): void{
        if(confirm(`Are you sure you want to delete the company ${this.company.abbreviation} (${this.company.name}) and all it's related stocks and data? (WARNING: THIS ACTION CANNOT BE UNDONE)`)){
             this.companyService.deleteCompany(this.company.id)
             .subscribe({
                 next: () => this.router.navigate(['/stockmaker']),
                 error: err => this.errorMessage = err
             });
         }
    }
      
}