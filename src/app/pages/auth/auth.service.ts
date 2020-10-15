import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  loggedInUsername = new Subject<string>();

  signUp(postData) {
    return this.http
      .post('http://127.0.0.1:3000/user/signup', postData);
  }

  signIn(postData: { email; password }) {
    return this.http
      .post('http://127.0.0.1:3000/user/login', postData);
  }

}
