import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private http: HttpClient) {}


  signIn(postData: { email; password }) {
    return this.http
      .post('http://127.0.0.1:3000/user/login', postData)
      .subscribe((responseData) =>{}, errorMessage => {
      });
  }
}
