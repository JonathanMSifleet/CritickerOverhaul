import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoginMode = true;

  ngOnInit() {}

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  signIn(postData): void {
    this.authService.signIn(postData).subscribe((responseData) => {
      // @ts-expect-error
      localStorage.setItem('loggedInUsername', responseData.user.username);
      this.router.navigate(['']);
    });
  }

  signUp(postData: { username; firstName; email; password }): void {
    this.authService.signUp(postData).subscribe((responseData) => {
      this.switchMode();
    });
  }

}
