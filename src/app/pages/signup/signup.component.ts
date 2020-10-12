import { SignupService } from './signup.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './../../shared-css/loginSignup.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient, private signupService: SignupService, private router: Router) {}

  ngOnInit(): void {}

  signUp(postData: { username; firstName; email; password }) {
    this.signupService.signUp(postData);
    this.router.navigate(['/login']);
}
}
