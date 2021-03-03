import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ICompany} from '../shared/company-models/company';
import {CompanyService} from '../shared/company-service/company.service';
import {NotifierService} from '../shared/Notifications/notifier.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AddStockPriceComponent} from "./add-stock-price/add-stock-price.component";
import {UpdateStockNameComponent} from './update-stock-name/update-stock-name.component';
import {DeleteStockComponent} from './delete-stock/delete-stock.component';
import {CreateNewStockComponent} from './create-new-stock/create-new-stock.component';



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
    companyData:stockData[];
    companyInfo:stockData;

    displayedColumns:string[] = ['name', 'abbr', 'stockPrice'];
    dataSource: MatTableDataSource<stockData>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private companyService: CompanyService, 
        private notiferService:NotifierService,
        private dialog:MatDialog){

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

      openAddStockDialog(stock_id:number, stockprice:string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        dialogConfig.data = {
            id:stock_id,
            currentStockPrice:stockprice
        };

        this.dialog.open(AddStockPriceComponent, dialogConfig);
    }

    openUpdateStockNameDialog(stock_id:number, stockName:string, abbr:string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        dialogConfig.data = {
            id:stock_id,
            currentStockName:stockName,
            abbreviation:abbr
        };

        this.dialog.open(UpdateStockNameComponent, dialogConfig);
    }

    openDeleteStockDialog(stock_id:number, stockName:string, abbr:string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        dialogConfig.data = {
            id:stock_id,
            name:stockName,
            abbr:abbr
        };

        this.dialog.open(DeleteStockComponent, dialogConfig);
    }

    openCreateStockDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(CreateNewStockComponent, dialogConfig);
    }
    
    

    
      

    //calls on companyService to get the data from the server
    getCompanies(): void{
        this.companyService.getCompanies().subscribe({
            next: companies =>{
                this.companyData = this.companyFormatter(companies);
                this.dataSource = new MatTableDataSource (this.companyData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                console.log("Obtained data!");
            },
            error: err => this.errorMessage = err     
        });
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

    selectStock():void {
    }
}