import { Component } from '@angular/core';

@Component({
    selector: 'jtfj-home',
    template: `<router-outlet></router-outlet>`,
})
export class HomeComponent {

    constructor() {

        console.debug(`HomeComponent: ctor: Entering.`);

    } // constructor
}
