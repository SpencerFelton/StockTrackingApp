//TODO: Sort by time period


import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {ChartDataSets, ChartOptions, Chart} from 'chart.js';
import {BaseChartDirective,Color, Label} from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import {ICompanyView} from '../company-models/companyView';

import { CompanyServiceClient } from '../company-service-client/company-service-client';


@Component({
    selector: 'app-stock-chart',
    templateUrl: './stock-chart.component.html',
    styleUrls:['./stock-chart.component.css']
})

export class StockChartComponent implements OnChanges, OnInit{
    @Input() stockId:number; //<--Change to abbr once abbr implementation is complete
    chart:any;
    stockInformation:ICompanyView; //<-stock info
    stockHistory:any[]; //<-- stock history (is any)
    data:any[] = [];
    errorMessage:string;
    name:string = '';
    abbreviation:string = '';
    lineLabel:any;

    constructor(private companyServiceClient:CompanyServiceClient){
    }

     getCompany(id:number){
        if(id != 0){
            this.companyServiceClient.getCompanyClient(id)
            .subscribe({
            next: (company: any) => {
                this.stockInformation = company;
                this.name = this.stockInformation.name;
                this.abbreviation = this.stockInformation.abbreviation;
                console.log("PLEASE ACKNOWLEDGE ME!");},
                error: err => this.errorMessage = err
            })

        }
    }

     getCompanyHistory(id:number){
        if(id != 0){
            this.companyServiceClient.getCompanyClientHistory(id)
            .subscribe({
            next: (stockHistory: any) => {
                this.stockHistory = stockHistory;
                console.log("Added to StockHistory!");
                this.data = this.dataGenerator(this.stockHistory);
                this.lineLabel = this.labelGenerator(this.stockHistory);
                this.generateChart();},
                error: err => this.errorMessage = err
            })

        }
    }

        //data generator takes the raw stock history data and turns it into data that the graph can then plot
    dataGenerator(companyHistory:any[]):any{
        let dataGenerated:any[] = [];
        companyHistory.forEach(element => {
            dataGenerated.push({t:element.dateTime+'Z',y:element.price});
        });      
        return dataGenerated;
    }

    labelGenerator(companyHistory:any[]):any{
        let labels:Label[] = [];
        return labels;
    }



    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCompany(this.stockId);
        this.getCompanyHistory(this.stockId);
    }

    generateChart():void{
        if(!this.chart) {
          this.chart = new Chart("linechart", {
            type: 'line',
            options: {
              scales: {
                xAxes: [{
                  type: 'time',
                }]
              }
            },
            data: {
              labels: this.lineLabel,
              datasets: [{
                label: 'Demo',
                data: this.data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            }
          });  
        } else{
            this.updateChartDataFromStart(this.chart, this.data)
        }
        
        //this.chart.update();

    }
    

    

      updateChartDataFromStart(chart, data){
        chart.data.datasets[0].data = data;
        chart.update();
      }

      updateChartData(chart, data,index){
        chart.data.datasets[index].data = data;
        chart.update();
      }
      
    
}

