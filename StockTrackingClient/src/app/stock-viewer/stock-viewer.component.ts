import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyServiceClient } from '../shared/company-service-client/company-service-client';
import { ICompanyView } from '../shared/company-models/companyView';
import {ObjectConverter} from '../shared/ObjectConverter/object-converter';
import {NotifierService} from '../shared/Notifications/notifier.service';
import {SortDirective} from '../directive/sort.directive';

@Component({
    selector: 'pm-stockview',
    templateUrl: './stock-viewer.component.html',
    styleUrls: ['./stock-viewer.component.css']
})
export class StockViewer implements OnInit {
    //Shows the title to the application
    pageTitle: string = 'Stock List';
    //shows potential error mesag
    errorMessage:string;
    sortedColumn: string;

    stockShown:any[] = [,false];
    tableHeaders: string[][] = [["Company Name", "desc", "name"], ["Shorthand", "desc", "abbreviation"], ["Current Stock Price", "desc", "price"]]
    foundIndex: number;


    _listFilter: string = '';
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredCompanies= this.listFilter ? this.performFilter(this.listFilter) : this.companies;
    }    

    constructor(private companyServiceClient: CompanyServiceClient,private NotifierService:NotifierService){
        this.filteredCompanies = this.companies;
        this.listFilter = '';
    }
    
    filteredCompanies: any[];
    companies: any[]= [];

    public chartClicked({ event, active }: {event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }
    public chartHovered({ event, active }: {event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }


    sortColumn(header: string[]): void {
        //alert("ts sort alert");
        this.sortedColumn = header[0];
        for (let i=0; i<this.tableHeaders.length; i++){
            if (this.tableHeaders[i][0] === header[0]){
                this.foundIndex = i;
                break;
            }
        }
        if(header[1] === "desc"){
            this.tableHeaders[this.foundIndex] = [header[0], "asc", header[2]];
        }else if(header[1] === "asc"){
            this.tableHeaders[this.foundIndex] = [header[0], "desc", header[2]];
        }
    }


    performFilter(filterBy: string): ICompanyView[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.companies.filter((product: ICompanyView) => product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    
    subUnsub(company:ICompanyView): void {
       company.subscribed = !company.subscribed
       /*
       this.companyServiceClient.modifyStockClient(company).subscribe({
        next: () => {console.log("Sucessfully subscribed");
        if(company.subscribed) this.NotifierService.showNotification("Subscription added!", "OK","success","tick");
        else this.NotifierService.showNotification("Subscription removed!", "OK","success","tick")        
       },
            //this.individualStatus = new Array(companies.length).fill(0);
        error: () => {
            err => this.errorMessage = err;
            this.NotifierService.showNotification("Error adding subscription!", "OK","success","cross");
        }
       });
       */
    }

    showHistory(stockId: number) : void {
        console.log("Here is the stockshown");
        console.log(String(this.stockShown[0]));
        console.log("Here is the stockid");
        console.log(stockId);

        if(this.stockShown[0] == stockId){
            this.stockShown[1] = !this.stockShown[1];  
        } else{
            this.stockShown[1] = true;
            this.stockShown[0] = stockId;
        }
    }

    ngOnInit(): void {
        console.log('In OnInit');
        this.getCompanies();  
        
    }

    getCompanies():void{
        this.companyServiceClient.getCompaniesClient().subscribe({
            next: companies =>{

                this.companies = companies;
                this.filteredCompanies = this.companies;
                //this.individualStatus = new Array(companies.length).fill(0);
            },
            error: err => this.errorMessage = err
            
        });
    }
    /*
    getCompany(id: number): void{
        if(id != 0){
            this.companyServiceClient.getCompanyClient(id)
            .subscribe({
            next: (company: any) => {
                this.company = company;},
                error: err => this.errorMessage = err
        })
        console.log(this.company.name);

    }
    */
/*
    onSellStock(company:ICompanyView): void{
        if(company.stocksPurchased > 0){
            company.stocksPurchased -=1;
            this.companyServiceClient.modifyStockClient(company)
            .subscribe({
                next: () => {
                    console.log("Sucessfully sold stock!");
                    this.NotifierService.showNotification("Stock sucessfully sold!", "OK","success","tick");

                },
                error: () =>{
                    err => this.errorMessage = err;
                    this.NotifierService.showNotification("Error occured whilst selling stock!", "OK","error","cross");
                } 
        });
    }
        else{
        }
        
    }

    onBuyStock(company:ICompanyView): void{
        company.stocksPurchased +=1;
        this.companyServiceClient.modifyStockClient(company)
        .subscribe({
            next: () =>{
                console.log("Sucessfully bought stock!");
                this.NotifierService.showNotification("Stock sucessfully purchased!", "OK","success","tick");

            },
            error: () => {
                err => this.errorMessage = err;
                this.NotifierService.showNotification("Error occured whilst buying stock!", "OK","error","cross");
            } 
    });
    }
    */
    
}
