import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  // passing auth service in constructor injects it
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoginMode = true;
  usernameSubscription;

  ngOnInit() {
    this.usernameSubscription = this.authService.loggedInUsername.subscribe();
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  signIn(postData): void {
    this.authService.signIn(postData).subscribe((responseData) => {
      // @ts-expect-error
      this.setUsername(responseData.user.username);
      this.router.navigate(['']);
    });
  }

  signUp(postData: { username; firstName; email; password }): void {
    this.authService.signUp(postData).subscribe((responseData) => {
      this.switchMode();
    });
  }

  setUsername(username: string) {
    this.authService.loggedInUsername.next(username);
  }

}
