import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    selector: 'team-member-cards',
    templateUrl: './team-member-cards.component.html',
    styleUrls: ['./team-member-cards.component.scss'],
    animations:[
        trigger('fade', [
            state('void', style({opacity: 0 })),
            state('*', style({opacity: 100})),
            transition('void <=> *', [
                animate(200)
            ])
        ]),
        trigger('fadefrominvis',[
            state('active', style({backgroundColor:'var(--tertiary-colour)'})),
            state('*', style({backgroundColor: '#FFFFFFFF'})),
            transition('* <=> active', [
                animate(200)
            ])

        ])
        
    ]
})

export class TeamMemberCardsComponent {
    
    showingDetails:boolean = false;

    constructor(){}

    onClicked(){
        this.showingDetails = !this.showingDetails;
        console.log("You clicked me! You really, really clicked me!");
    }


}