import { Directive, Input, ElementRef, Renderer2, HostListener, Host } from '@angular/core';
import { Sort } from '../util/sort';

@Directive({
    selector: '[appSort]'
})
export class SortDirective {
    @Input() appSort: Array<any>;
    constructor(private renderer: Renderer2, private targetElem: ElementRef) {}

    @HostListener('click', ['$event']) onclick($event){
        this.sortData()
    }
    sortData() {
        alert("header clicked");
        const sort = new Sort();
        const elem = this.targetElem.nativeElement;
        const order = elem.getAttribute("data-order");
        const type = elem.getAttribute("data-type");
        const property = elem.getAttribute("data-name");
        if (order === "desc") {
            this.appSort.sort(sort.startSort(property, order, type));
            elem.setAttribute("data-order", "asc");
        }
        else {
            this.appSort.sort(sort.startSort(property, order, type));
            elem.setAttribute("data-order", "desc");
        }
    }
}