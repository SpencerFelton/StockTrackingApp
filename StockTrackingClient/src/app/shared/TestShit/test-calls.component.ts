import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: "pm-testcalls",
    templateUrl: "./test-calls.component.html",
    styleUrls: ["./test-calls.component.css"]
})

export class TestCallsComponent{
    readonly ROOT_URL = 'https://jsonplaceholder.typicode.com';

    posts:any;

    constructor(private http:HttpClient){}

    getPosts(){
        this.posts = this.http.get(this.ROOT_URL + '/posts');
    }
}