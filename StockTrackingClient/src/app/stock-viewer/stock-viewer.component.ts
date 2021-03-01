import {Component, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {ICompany} from '../shared/company-models/company';
import {CompanyServiceClient} from '../shared/company-service-client/company-service-client';
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
    selector: 'pm-stockview',
    templateUrl: './stock-viewer.component.html',
    styleUrls: ['./stock-viewer.component.css'],
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
export class StockViewer implements OnInit {

    pageTitle="Stock List";
    errorMessage="";
    stockShown:any[] = [,false];
    type = "client";

    displayedColumns:string[] = ['name', 'abbr', 'stockPrice'];
    dataSource: MatTableDataSource<stockData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private companyService: CompanyServiceClient, private notiferService:NotifierService){

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
        this.companyService.getCompaniesClient().subscribe({
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

    subscribeUnsubscribe(){
        
    }

    
}
