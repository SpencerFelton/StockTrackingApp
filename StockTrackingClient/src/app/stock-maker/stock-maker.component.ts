import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ICompany} from '../shared/company-models/company';
import {CompanyService} from '../shared/company-service/company.service';
import {NotifierService} from '../shared/Notifications/notifier.service';


@Component({
    selector: "pm-stockmaker",
    templateUrl: "./stock-maker.component.html",
    styleUrls: ["./stock-maker.component.css"]
})

export class StockMaker implements OnChanges, OnInit{
 
    pageTitle = "Change"
    statusString: string[] =["New", "Modify", "Update"];
    sortedColumn: string;
    tableHeaders: string[][] = [["Company Name", "desc", "name"], ["Shorthand", "desc", "abbreviation"], ["Current Stock Price", "desc", "price"]]
    foundIndex: number;
    //individualStatus: number[];

    filteredCompanies: ICompany[];


    companies: ICompany[] = []

    _listFilter:string;
    errorMessage: string;

    get listFilter():string{
        return this._listFilter;
    }

    set listFilter(value: string){
        this._listFilter = value;
        this.filteredCompanies = this._listFilter? this.performFilter(this.listFilter): this.companies;
    }

    constructor(private companyService: CompanyService, private notiferService:NotifierService){
        this.listFilter = '';
    }

    ngOnInit(): void {
        this.getCompanies();  
    }

    getCompanies(): void{
        this.companyService.getCompanies().subscribe({
            next: companies =>{
                this.companies = companies;
                this.filteredCompanies = this.companies;
                //this.individualStatus = new Array(companies.length).fill(0);
            },
            error: err => this.errorMessage = err
            
        });
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


    ngOnChanges(changes: SimpleChanges): void {
        /*
        for(var i = 0; i<this.companies.length; i++){
            console.log(this.companies[i].stockPriceNew);
        }
        */
        
    }

    performFilter(filterBy: string) :ICompany[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.companies.filter((company:ICompany) =>
                                    company.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }

}