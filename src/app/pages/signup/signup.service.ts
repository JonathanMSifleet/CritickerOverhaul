import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SignupService {
  constructor(private http: HttpClient) {}

  signUp(postData) {
    return this.http
      .post('http://127.0.0.1:3000/user/signup', postData)
      .subscribe((responseData) =>{}, errorMessage => {
      });
  }
}
