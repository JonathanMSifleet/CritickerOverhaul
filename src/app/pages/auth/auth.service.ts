import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {
    // console.log('auth service initialised', window.location.href);
  }

  private usernameSource = new BehaviorSubject<string>(undefined);
  loggedInUsername = this.usernameSource.asObservable();

  updateUsername(newUsername: string): void {
    this.usernameSource.next(newUsername);
  }

  signUp(postData): Observable<object> {
    return this.http
      .post('http://127.0.0.1:3000/user/signup', postData);
  }

  signIn(postData: { email; password }): Observable<object> {
    return this.http
      .post('http://127.0.0.1:3000/user/login', postData);
  }

}
