import { Component, OnInit }    from '@angular/core';
import { Router }               from '@angular/router';
import { ROUTER_DIRECTIVES }    from '@angular/router';
import { CollectionService }    from './collection/collection.service';
import { AuthService }          from './auth/auth.service';
import { HeaderComponent}       from './header/header.component';

import '../style/app.scss';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    directives: [ROUTER_DIRECTIVES, HeaderComponent],
    providers: [CollectionService]
})

export class AppComponent {
    constructor(public authService: AuthService, public router: Router) {
        authService.initCurrentUser().then(success => {            
        });
    }
}
