import {Component, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit} from '@angular/core';
import {CompanyServiceClient} from 'src/app/shared/company-service-client/company-service-client';
import {NotifierService} from 'src/app/shared/Notifications/notifier.service';
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
    selector: 'pm-subscriptionviewer',
    templateUrl: './subscription-viewer.component.html',
    styleUrls: ['./subscription-viewer.component.css'],
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
export class SubscriptionViewer implements OnInit {
    pageTitle="Stock List";
    errorMessage="";
    stockShown:any[] = [,false];
    type = "client";    
    companyInfo:stockData;
    companyData:stockData[];
    subscribedCompanyData:stockData[];
    subscribedCompanyDataRaw:any;
    idsGenerated:number[];
    gotSubscribedIds = false;
    gotCompanyData =false;

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
        this.getSubscribedIds();
    }
      
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    
    getSubscribedIds():void{
        this.companyService.getSubscribedIds().subscribe({
            next: subscribedCompanies =>{
                this.subscribedCompanyDataRaw = subscribedCompanies;
                console.log("I am gettting subsdcribedIDs");
                console.log(this.subscribedCompanyDataRaw);
                this.idsGenerated = this.generateIDArray(this.subscribedCompanyDataRaw);
                this.gotSubscribedIds = true;
                if(this.gotCompanyData){
                    this.subscribedCompanyData = this.getCompaniesByID(this.idsGenerated,this.companyData);
                    this.generateTable(this.subscribedCompanyData);
                }     
            }
        })
    }


    generateIDArray(object:any[]){
        var idArray=[];
        object.forEach(row =>{
            idArray.push(row.stock_id);
        })
        console.log("ID array generated!");
        console.log(idArray);
        return idArray;
    }

    getCompaniesByID(intArray:number[], AllCompanies:any[]){
        console.log("Get companies by ID");
        console.log(intArray);
        console.log(AllCompanies);
        var subCompanies=[];
        intArray.forEach(id => 
        {
            subCompanies.push(AllCompanies.find(row => row.id === id));
        });
        console.log("subscribed companies!");
        console.log(subCompanies);
        return subCompanies;   
    }

    getCompanies(): void{
        this.companyService.getCompaniesClient().subscribe({
            next: companies =>{
                this.companyData = this.companyFormatter(companies);
                console.log("Hello up there!");
                this.gotCompanyData = true;
                if(this.gotSubscribedIds){
                    this.subscribedCompanyData = this.getCompaniesByID(this.idsGenerated, this.companyData);
                    this.generateTable(this.subscribedCompanyData);
                }     
            },
            error: err => this.errorMessage = err     
        });
    }



    /* 
     this.dataSource = new MatTableDataSource (this.subscribedCompanyData );
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                console.log("Obtained data!");
                console.log("Got company data!")
                console.log(this.subscribedCompanyData);
    */


    isSubscribed(stock_id):boolean{
        //console.log("I am here!!!!!");
        //console.log(this.subscribedCompanyData);
        //console.log(this.subscribedCompanyData.find(company => company.id == stock_id)== undefined);
        if(this.subscribedCompanyData.find(company => company.id == stock_id) == undefined){
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
        this.companyInfo = this.subscribedCompanyData.find(x=> x.id == stockId);
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
