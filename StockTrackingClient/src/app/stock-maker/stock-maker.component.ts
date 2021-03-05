import {Component, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {ICompany} from '../shared/company-models/company';
import {CompanyService} from '../shared/company-service/company.service';
import {NotifierService} from '../shared/Notifications/notifier.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface stockData {
    id:number;
    name: string;
    abbr:string;
    stockPrice:string;
  }
  
@Component({
    selector: "pm-stockmaker",
    templateUrl: "./stock-maker.component.html",
    styleUrls: ["./stock-maker.component.css"],
    animations:[
        trigger('moveUp', [
            state('active', style({backgroundColor: '#999999' })),
            //state ('inactive', style(*)),
            transition('* <=> active', [
                animate(100)
            ]),

        ])
    ]
})

export class StockMaker implements OnChanges, OnInit{
    
    pageTitle="Provider stocks";
    errorMessage="";
    stockShown:any[] = [,false];
    type = "provider";

    displayedColumns:string[] = ['name', 'abbr', 'stockPrice'];
    dataSource: MatTableDataSource<stockData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private companyService: CompanyService, private notiferService:NotifierService){

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Method not implemented.');
    }
    ngOnInit(): void {
        this.getCompanies();
    }
    /*
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      */
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    
      

    //calls on companyService to get the data from the server
    getCompanies(): void{
        this.companyService.getCompanies().subscribe({
            next: companies =>{
                this.dataSource = new MatTableDataSource (this.companyFormatter(companies));
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                console.log("Obtained data!");
            },
            error: err => this.errorMessage = err     
        });
    }

    companyFormatter(rawCompanyData:any[]):stockData[]{
        console.log("We are here!");
        console.log(JSON.stringify(rawCompanyData));
        var allStocks:stockData[] = [];
        rawCompanyData.forEach(element => {
            if(element.priceHistory != null){
                console.log(element.id);
                console.log(element.name);
                allStocks.push({id:element.stock_id, name:element.name, abbr:element.abbreviation,stockPrice:element.priceHistory.value});
            }else{
                allStocks.push({id:element.stock_id, name:element.name, abbr:element.abbreviation,stockPrice:"N/A"});
            }
            
        });

        return allStocks;
    }
    //,
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

        console.log(`stock is: ${this.stockShown[0]}, is showing is: ${this.stockShown[1]}`);
    }

    selectStock():void {

    }


    /*
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


    





    /*
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
    /*    
    }
    
    performFilter(filterBy: string) :ICompany[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.companies.filter((company:ICompany) =>
                                    company.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }
      */
      

}