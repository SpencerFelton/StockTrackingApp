import { Component, OnInit } from '@angular/core';
import { CompanyServiceClient } from '../shared/company-service-client/company-service-client';
import { ICompanyView } from '../shared/companyView';

@Component({
    selector: 'pm-subscriptionView',
    templateUrl: './subscriptionView.component.html',
    styleUrls: ['./subscriptionView.component.css']
})
export class subscriptionView implements OnInit {
    pageTitle: string = 'Subscription List';
    errorMessage:string;

    _listFilter: string = '';

    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredCompanies= this.listFilter ? this.performFilter(this.listFilter) : this.companies;
    }    

    constructor(private companyServiceClient: CompanyServiceClient){
        //this.filteredCompanies = this.companies;
        this.listFilter = '';
        //this.subscribedCompanies = this.companies;
    }
    
    //subscribedCompanies: ICompanyView[];
    filteredCompanies: ICompanyView[];
    companies: ICompanyView[]= [];




    performFilter(filterBy: string): ICompanyView[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.companies.filter((product: ICompanyView) => product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    subUnsub(company:ICompanyView): void {
        company.subscribed = !company.subscribed
        this.companyServiceClient.modifyStockClient(company).subscribe({
         next: () => console.log("Sucessfully subscribed"),
             //this.individualStatus = new Array(companies.length).fill(0);
         error: err => this.errorMessage = err
        });
     }

    ngOnInit(): void {
        console.log('In OnInit');
        this.getSubscribedCompanies();  
        //this.getSubs(this.companies);
    }

    getSubscribedCompanies():void{
        this.companyServiceClient.getSubscribedCompanies().subscribe({
            next: companies =>{
                this.companies = companies;
                this.filteredCompanies = this.companies;
                //this.individualStatus = new Array(companies.length).fill(0);
            },
            error: err => this.errorMessage = err
            
        });
    }

    onSellStock(company:ICompanyView): void{
        if(company.stocksPurchased > 0){
            company.stocksPurchased -=1;
            this.companyServiceClient.modifyStockClient(company)
            .subscribe({
                next: () => console.log("Sucessfully sold stock!"),
                error: err => this.errorMessage = err
        });
    }
        else{
        }
        
    }

    onBuyStock(company:ICompanyView): void{
        company.stocksPurchased +=1;
        this.companyServiceClient.modifyStockClient(company)
        .subscribe({
            next: () => console.log("Sucessfully bought stock!"),
            error: err => this.errorMessage = err
    });
    }
}