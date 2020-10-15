import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
    public authService: AuthService,
    private router: Router
  ) {}

  isLoginMode = true;

  ngOnInit(): void {
    this.authService.loggedInUsername.subscribe(data => {});
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  signIn(postData): void {
    this.authService.signIn(postData).subscribe((responseData) => {
      // @ts-expect-error
      this.setUsername(responseData.user.username);
      this.router.navigate(['/home']);
    });
  }

  signUp(postData: { username; firstName; email; password }): void {
    this.authService.signUp(postData).subscribe((responseData) => {
      this.switchMode();
    });
  }

  setUsername(username: string): void {
    this.authService.updateUsername(username);
    localStorage.setItem('loggedInUsername', username);
  }

}
