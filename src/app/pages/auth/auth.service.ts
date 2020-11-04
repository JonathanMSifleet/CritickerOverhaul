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
    console.log('new user data', newUserData);
    this.userDataSource.next(newUserData);
  }

  signUp(postData): Observable<object> {
    return this.http
      .post('https://h8stv3r5xl.execute-api.eu-west-2.amazonaws.com/dev/signup', postData);
  }

  signIn(postData: { email; password }): Observable<object> {
    return this.http
      .post('https://h8stv3r5xl.execute-api.eu-west-2.amazonaws.com/dev/login', postData);
  }

}
