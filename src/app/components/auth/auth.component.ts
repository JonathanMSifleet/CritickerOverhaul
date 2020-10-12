import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

constructor(private authService: AuthService, private router: Router) {}

isLoginMode = true;

ngOnInit(): void {}

switchMode() {
  this.isLoginMode = this.isLoginMode;
}

signIn(postData): void {
  this.authService.signIn(postData);
  this.router.navigate(['']);
}

signUp(postData: { username; firstName; email; password }) {
  this.authService.signUp(postData);
  this.router.navigate(['/login']);
}

}
