//TODO: Sort by time period


import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {ChartDataSets, ChartOptions, Chart} from 'chart.js';
import {BaseChartDirective,Color, Label} from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import {ICompanyView} from '../company-models/companyView';

import { CompanyServiceClient } from '../company-service-client/company-service-client';
import { fromEvent } from 'rxjs';
import { CompanyService } from '../company-service/company.service';
//import './my-path/chartjs-chart-financial';


@Component({
    selector: 'app-stock-chart',
    templateUrl: './stock-chart.component.html',
    styleUrls:['./stock-chart.component.css']
})

export class StockChartComponent implements OnChanges, OnInit{
    @Input() stockId:number; //<--Change to abbr once abbr implementation is complete
    @Input() type:string;
    @Input() update = false;

    @ViewChild('chartSlider') chartSlider:ElementRef;
    
    chart:any;
    stockInformation:any;
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
    yaxisType="1";
    increments:number;
    graphRangeApprox:string;
    graphRangeAcc:string;
    colour:string = "#004fba";  
    hasData:boolean = false;


    formatLabel(value: number) {
      if (value >= 1000) {
        return Math.round(value / 1000) + 'k';
      }
      return value;
    }
    

    

    constructor(private companyServiceClient:CompanyServiceClient,
                private companyService:CompanyService){
    }


    alternateFormatter(value:number){
      var output = "";
      var minutes = 1000 * 60;
      var minutesInDay = 1436;
      var avWeeksInMonth= 4.34812143;

      
      console.log(`Chart date: ${new Date(this.chartLatestDate.t).getTime()}`);
      var timeElapsed = (new Date(this.chartLatestDate.t).getTime() - new Date(this.oneDayOff).getTime()) + value*this.increments;
      var timeElapasedMinutes = timeElapsed/minutes;

      if(timeElapasedMinutes >=minutesInDay && timeElapasedMinutes < (minutesInDay*7)){
        output = `${(timeElapasedMinutes/minutesInDay).toFixed(2)}d`;
      }else if(timeElapasedMinutes >=(minutesInDay*7) && timeElapasedMinutes < (minutesInDay*7)*avWeeksInMonth){
        output = `${(timeElapasedMinutes/(minutesInDay*7)).toFixed(2)}w`;
      }else if(timeElapasedMinutes >=minutesInDay*7*avWeeksInMonth && timeElapasedMinutes < minutesInDay*7*avWeeksInMonth*12){
        output = `${(timeElapasedMinutes/(minutesInDay*7*avWeeksInMonth)).toFixed(2)}m`;
      }else{
        output = `${(timeElapasedMinutes/(minutesInDay*7*avWeeksInMonth*12)).toFixed(2)}y`;
      }
      return output;
    }

    alFormatter(value:number){
      var output = "";
      var minutes = 1000 * 60;
      var minutesInDay = 1436;
      var avWeeksInMonth= 4.34812143;


      console.log(`Chart date: ${new Date(this.chartLatestDate.t).getTime()}`);
      var timeElapsed = (new Date(this.chartLatestDate.t).getTime() - new Date(this.oneDayOff).getTime()) + value*this.increments;
      var timeElapasedMinutes = timeElapsed/minutes;

      if(timeElapasedMinutes >=minutesInDay && timeElapasedMinutes < (minutesInDay*7)){
        output = `>${Math.trunc(timeElapasedMinutes/minutesInDay)}d`;
      }else if(timeElapasedMinutes >=(minutesInDay*7) && timeElapasedMinutes < (minutesInDay*7)*avWeeksInMonth){
        output = `>${ Math.trunc(timeElapasedMinutes/(minutesInDay*7))}w`;
      }else if(timeElapasedMinutes >=minutesInDay*7*avWeeksInMonth && timeElapasedMinutes < minutesInDay*7*avWeeksInMonth*12){
        output = `>${ Math.trunc(timeElapasedMinutes/(minutesInDay*7*avWeeksInMonth))}m`;
      }else{
        output = `>${ Math.trunc(timeElapasedMinutes/(minutesInDay*7*avWeeksInMonth*12))}y`;
      }

      if(value == 0){
        output = "1d";
      }else if (value == this.max){
        output = "All";
      }
      return output;
    }


    getCompany(id:number){        
       if(this.type == "client"){
            this.companyServiceClient.getCompanyClient(id).subscribe({
            next: (company: any) => {
                this.stockInformation = company;
                //console.log("(1)asdas");
                this.name = this.stockInformation.name;
                this.abbreviation = this.stockInformation.abbreviation;
                },
                error: err => this.errorMessage = err
            })
       }else{
        this.companyService.getCompany(id).subscribe({
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
       if(this.type == "client"){
            this.companyServiceClient.getCompanyClientHistory(id).subscribe({
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

       }else{
          this.companyService.getCompanyHistory(id).subscribe({
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCompanyHistory(this.stockId);
        console.log()
        this.graphRangeApprox=this.alFormatter(this.value);
        this.graphRangeAcc = this.alternateFormatter(this.value);
        this.update = false;

    }

    generateChart():void{
          this.chart = new Chart("linechart", {
            type: 'line',
            options: {
              legend:{
                display: false
              },
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
                //label: 'Demo',
                lineTension: 0,
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
        //this.hasData = true;
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

      onColourChange(event:any){
        console.log("I'm here!");
        this.colour = event;
        console.log(event);
        this.updateChartColour(event);
      }

      updateChartData(chart, data,index){
        chart.data.datasets[index].data = data;
        chart.update();
      }

      onInputChange(event: any) {
        this.value = event.value; 
        this.updateChartAxis(this.value);
        this.graphRangeApprox=this.alFormatter(this.value);
        this.graphRangeAcc = this.alternateFormatter(this.value);
        
      }

      updateChartColour(colour:string){
        if(this.chart){
          console.log("Hellooo!");
          //console.log(JSON.parse(this.chart));
          console.log(this.chart.datasets);
          this.chart.data.datasets[0].borderColor = colour;
          var backColour = `${colour}1B`;
          this.chart.data.datasets[0].backgroundColor = backColour;
          this.chart.update();
        }
      }

      updateChartAxis(value:number){
        this.increments = ( this.oneDayOff.getTime() - new Date(this.chartEarliestDate.t).getTime())/(this.max - this.min);
        if(this.chart){
          this.chart.options.scales.xAxes[0].ticks.min = this.oneDayOff.getTime() - value*this.increments;
            if(this.data.length <=1){
              this.chart.options.scales.xAxes[0].ticks.max = new Date(this.chartLatestDate.t).getTime() - value*this.increments;
            }
          this.chart.update();
        }
      }

      yaxisConfigure(event:any){
        console.log(this.chart);
        if(event.value == 1){
          this.chart.options.scales.yAxes[0]= {
            type: 'linear'
          }
        }else{
          this.chart.options.scales.yAxes[0]= {
            type: 'logarithmic'
          }
        }
        this.chart.update();
      }

      


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

