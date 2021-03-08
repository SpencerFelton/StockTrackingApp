import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector:'app-rulergenerator',
    templateUrl:'./ruler-generator.component.html',
    styleUrls:['./ruler-generator.component.css']

})

export class RulerGeneratorComponent implements OnInit{
@Input() startDate:any;
@Input() EndDate:any;

    constructor(){}


    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    generateRuler(){

    }


}