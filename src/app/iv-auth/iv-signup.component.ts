import { Component }   from '@angular/core';
import { ROUTER_DIRECTIVES, Router }      from '@angular/router';
import { IvAuthService } from './iv-auth.service';
import { IvUser }        from '../iv-user/iv-user.class';

@Component({
    selector: 'iv-signup',
    templateUrl: './iv-signup.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class IvSignupComponent {

    signupData = new class SignupData{
        username: string;
        email: string;
        password: string;
        passwordRepeat: string;
    };

    constructor(public authService: IvAuthService, public router: Router) {}

    onSignupSubmit() {
        let user = new IvUser(
            undefined,
            undefined,
            undefined,
            this.signupData.username,
            this.signupData.username,
            this.signupData.email,
            this.signupData.password
            );
        this.authService.signup(user).then(success => {
            console.log(success);
            this.router.navigate(['/']);
        });
    }

}
