//TODO: Sort by time period


import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {ChartDataSets, ChartOptions, Chart} from 'chart.js';
import {BaseChartDirective,Color, Label} from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import {ICompanyView} from '../company-models/companyView';

import { CompanyServiceClient } from '../company-service-client/company-service-client';
import { fromEvent } from 'rxjs';


@Component({
    selector: 'app-stock-chart',
    templateUrl: './stock-chart.component.html',
    styleUrls:['./stock-chart.component.css']
})

export class StockChartComponent implements OnChanges, OnInit{
    @Input() stockId:number; //<--Change to abbr once abbr implementation is complete
    @Input() type:string;

    @ViewChild('chartSlider') chartSlider:ElementRef;
    
    chart:any;
    stockInformation:any; //<-stock info
    stockHistory:any[]; //<-- stock history (is any)
    data:any[] = [];
    errorMessage:string;
    name:string = '';
    abbreviation:string = '';
    lineLabel:any;
    min = 0;
    max = 100;
    chartEarliestDate:any;
    chartLatestDate:any;
    step = 1;
    values = 0;
    oneDayOff = new Date();
    value = 0;
    selected = "1";
  


    formatLabel(value: number) {
      //console.log(value);
      if (value >= 1000) {
        return Math.round(value / 1000) + 'k';
      }
      return value;
    }

    

    constructor(private companyServiceClient:CompanyServiceClient){
    }


     getCompany(id:number){
        if(id != 0){
            this.companyServiceClient.getCompanyClient(id)
            .subscribe({
            next: (company: any) => {
                this.stockInformation = company;
                //console.log("(1)asdas");
                this.name = this.stockInformation.name;
                this.abbreviation = this.stockInformation.abbreviation;
                },
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
                this.earliestAndLatestDates(this.data);
                this.updateChartDataFromStart(this.chart, this.data, this.lineLabel, this.chartLatestDate.t);
                },
                error: err => this.errorMessage = err
            })

        }
    }

        //data generator takes the raw stock history data and turns it into data that the graph can then plot
    dataGenerator(companyHistory:any[]):any{
        let dataGenerated:any[] = [];
        companyHistory.forEach(element => {
            dataGenerated.push({t:element.time+'Z',y:element.value});
        });      
        return dataGenerated;
    }

    labelGenerator(companyHistory:any[]):any{
        let labels:Label[] = [];
        return labels;
    }



    ngOnInit(): void {
        this.generateChart();
        this.getCompany(this.stockId);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCompanyHistory(this.stockId);
        console.log()
        
        
    }

    generateChart():void{
          this.chart = new Chart("linechart", {
            type: 'line',
            
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                  type: 'time',
                  ticks: {
                  },
                  time:
                  {
                  }
                }]
              }
            },
            data: {  
              datasets: [{
                label: 'Demo',
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
    }
    

      sliderConfigure(event:any){
          console.log("We are here!");
           switch(event.value){
             case "1":
              console.log("1 Chosen!");
              this.max = 100;
               break;
             case "2":
              console.log("2 Chosen!");
              this.max = 200;
               break;
             case "3":
              console.log("3 Chosen!");
              this.max = 300;
               break;
           } 
      }

      updateChartDataFromStart(chart, data, labels, max){
        if(data.length != 0){
        chart.data.datasets[0].data = data;
        chart.data.labels[0] = labels;
        chart.options.scales.xAxes[0].ticks.max = max;
        this.updateChartAxis(this.value);
        console.log("Initial values");
        console.log(`Value: ${this.value}`);
        console.log(`Maximum: ${new Date(this.chart.options.scales.xAxes[0].ticks.max) }`);
        console.log(`Minimum: ${new Date(this.chart.options.scales.xAxes[0].ticks.min) }`);
        chart.update();
        }

      }

      updateChartData(chart, data,index){
        chart.data.datasets[index].data = data;
        chart.update();
      }

      onInputChange(event: any) {
        this.value = event.value;
        //console.log(`Latest Date: ${this.chartLatestDate.t}`);
        //console.log(`Earliest Date: ${this.chartEarliestDate.t}`);
        //console.log(`Latest Date again: ${new Date(this.chartLatestDate.t)}`);
        var result = new Date();
        //console.log(`Earliest Date again: ${(new Date(result.setDate(new Date(this.chartLatestDate.t).getDate() - 1)))}`);
  
        this.updateChartAxis(this.value);
        console.log("After moving slider");
        console.log(`Value: ${this.value}`);
        console.log(`Maximum: ${new Date(this.chart.options.scales.xAxes[0].ticks.max) }`);
        console.log(`Minimum: ${new Date(this.chart.options.scales.xAxes[0].ticks.min) }`);
        
      }

      updateChartAxis(value:number){
        
          var increments = ( this.oneDayOff.getTime() - new Date(this.chartEarliestDate.t).getTime())/(this.max - this.min);
        //console.log(this.chart);
        //console.log(`Increments: ${increments}`);
        if(this.chart){
          //console.log(value);
          this.chart.options.scales.xAxes[0].ticks.min = this.oneDayOff.getTime() - value*increments;
            if(this.data.length <=1){
              this.chart.options.scales.xAxes[0].ticks.max = new Date(this.chartLatestDate.t).getTime() - value*increments;
            }
          this.chart.update();
        }
        //console.log(`Earliest Date: ${this.chartEarliestDate.t}`);
        //console.log(`Latest Date: ${this.chartLatestDate.t}`);
        
        
        //console.log(``);
      }
      //- value*increments
      


      earliestAndLatestDates(data:any){
        this.chartEarliestDate = this.data.reduce(function (min,obj){
          return obj.t < min.t? obj: min;
        });

        this.chartLatestDate = this.data.reduce(function (max,obj){
          return obj.t > max.t? obj: max;
        });

        this.oneDayOff = new Date(this.chartLatestDate.t);
        this.oneDayOff.setDate(this.oneDayOff.getDate()-1);
        console.log(`One day off: ${this.oneDayOff}`);
        console.log(`Earliest Time: ${this.chartEarliestDate.t}`);
        console.log(`Latest Time: ${this.chartLatestDate.t}`);
      

      }  


      valueChanged(e) {
        console.log('e', e);
    }
    
}

