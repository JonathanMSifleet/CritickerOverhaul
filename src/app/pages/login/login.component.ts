import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './../../shared-css/loginSignup.css']
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  signIn(postData: { email; password }) {
    this.http
      .post('http://127.0.0.1:3000/user/login', postData)
      .subscribe((responseData) => {});
  }
}
