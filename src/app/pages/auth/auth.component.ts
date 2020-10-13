import { EventEmitterService } from './../../event-emitter/event-emitter.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { GlobalVariables } from './../../common/global-variables';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private globals: GlobalVariables,
    private eventEmitterService: EventEmitterService
  ) {}

  isLoginMode = true;

  ngOnInit() {}

  updateHeader() {
    this.eventEmitterService.onSignIn();
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  signIn(postData): void {
    this.authService.signIn(postData).subscribe((responseData) => {
      // @ts-expect-error
      this.globals.setLoggedInUsername(responseData.user.username);
      console.log('auth global username', this.globals.getLoggedInUsername());
      this.updateHeader();
      this.router.navigate(['']);

    });
  }

  signUp(postData: { username; firstName; email; password }): void {
    this.authService.signUp(postData).subscribe((responseData) => {
      this.switchMode();
    });
  }

}
