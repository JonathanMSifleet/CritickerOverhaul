import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', './../../shared-css/loginSignup.css']
})
export class SignupComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  signUp(postData: { username; firstName; email; password }) {
    this.http
      .post('http://127.0.0.1:3000/user/signup', postData)
      .subscribe((responseData) => {});
  }
}
