import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";


@Component({
    selector: "pm-percent",
    templateUrl: "./percent-change.component.html",
    styleUrls:["./percent-change.component.css"]
})

export class PercentChangeComponent implements OnChanges{
    
    @Input() potentialStockPrice: number;
    @Input() currentStockPrice: number;
    percentChange: number;

    ngOnChanges(changes: SimpleChanges): void {
        this.percentChange = (this.potentialStockPrice- this.currentStockPrice)/(this.currentStockPrice)*100;  
        console.log(this.potentialStockPrice);
        console.log(this.currentStockPrice);
        console.log(this.percentChange);
    }

}