import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(postData) {
    return this.http
      .post('http://127.0.0.1:3000/user/signup', postData)
      .subscribe((responseData) =>{
        // console.log('error', responseData);
      });
  }

  signIn(postData: { email; password }) {
    return this.http
      .post('http://127.0.0.1:3000/user/login', postData)
      .subscribe((responseData) =>{}, errorMessage => {
      });
  }
}
