import {Component, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {CompanyServiceClient} from '../../../../services/company-service-client';
import {NotifierService} from '../../../../services/notifier.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SubscribeUnsubscribeComponent} from "../dialog-boxes/subscribe-unsubscribe/subscribe-unsubscribe.component";

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

        ]),
        trigger('slideUpDown',[
            state('void', style({opacity: 0 })),
            state('*', style({opacity: 100})),
            transition('void <=> *',[
                animate(150)
            ])
        ])
    ]
})


export class StockViewer implements OnInit {

    pageTitle="Stock List";
    errorMessage="";
    stockShown:any[] = [,false];
    type = "client";    
    companyInfo:stockData;
    companyData:stockData[];
    subscribedCompanyData:any[];

    displayedColumns:string[] = ['name', 'abbr', 'stockPrice'];
    dataSource: MatTableDataSource<stockData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private companyService: CompanyServiceClient, 
        private notiferService:NotifierService,
        private dialog: MatDialog){

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Method not implemented.');
    }

    //TODO: Implement subscribes tock injectable that does all the calls and stores the subscribedstock
    ngOnInit(): void {
        this.getCompanies();
        this.getSubscribedStock();
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
                this.companyData = this.companyFormatter(companies);
                this.generateTable(this.companyData);
                console.log("Obtained data!");
            },
            error: err => this.errorMessage = err     
        });
    }
    
    getSubscribedStock():void{
        this.companyService.getSubscribedIds().subscribe({
            next: subscribedCompanies =>{
                this.subscribedCompanyData = subscribedCompanies;
                console.log(`Got company data!fdgfsg ${this.subscribedCompanyData}`);
                console.log(this.subscribedCompanyData);
            }
        });
    }


    isSubscribed(stock_id):boolean{
        //console.log("I am here!!!!!");
        //console.log(this.subscribedCompanyData);
        //console.log(this.subscribedCompanyData.find(company => company.stock_id == stock_id)== undefined);
        if(this.subscribedCompanyData.find(company => company.stock_id == stock_id) == undefined){
            //console.log("I Am unsubscribed!");
            return false;
            
        }else{
            //console.log("I Am subscribed!");
            return true;
        }
    }

    openSubscribedDialog(stock_id:number) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        dialogConfig.data = {
            id:stock_id,
            subbed:this.isSubscribed(stock_id)
        };

        this.dialog.open(SubscribeUnsubscribeComponent, dialogConfig);
    }


    subscribeToStock(stock_id:number){
        this.companyService.subscribeToStock(stock_id).subscribe({
            next: subscribedCompanies =>{
                //this.subscribedCompanyData = this.companyFormatter(subscribedCompanies);
                console.log("subscribed to stock!")
            }
        })
    }
    

        //finds the company information from the companyData object
    getCompanyFromCompanyData(stockId:number){
        this.companyInfo = this.companyData.find(x=> x.id == stockId);
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

    generateTable(companyData:stockData[]){
        this.dataSource = new MatTableDataSource (companyData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    
}
