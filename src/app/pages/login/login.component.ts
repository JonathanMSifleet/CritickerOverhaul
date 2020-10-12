import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './../../shared-css/loginSignup.css']
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) {}



  isValid = false;

  ngOnInit(): void {}

  signIn(postData): void {
    this.loginService.signIn(postData);
    this.router.navigate(['']);
  }
}
