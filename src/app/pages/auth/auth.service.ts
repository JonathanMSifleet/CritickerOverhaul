import { UserData } from './user-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  private userDataSource = new BehaviorSubject<UserData>(null);
  loggedInUserData = this.userDataSource.asObservable();

  updateUserData(newUserData: UserData): void {
    this.userDataSource.next(newUserData);
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
