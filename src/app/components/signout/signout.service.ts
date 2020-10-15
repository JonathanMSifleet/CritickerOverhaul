import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SignoutService {

  constructor(private http: HttpClient) {}

  signout() {
    return this.http
      .patch('http://127.0.0.1:3000/user/signOut', 'username goes here');
  }
}
