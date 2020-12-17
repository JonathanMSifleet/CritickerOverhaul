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

  signUp(postData: {
    username: string;
    firstName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Observable<object> {
    return this.http.post(
      'https://lvsrmt8ev9.execute-api.eu-west-2.amazonaws.com/dev/signup',
      postData
    );
  }

  signIn(postData: { email: string; password: string }): Observable<object> {
    return this.http.post(
      'https://lvsrmt8ev9.execute-api.eu-west-2.amazonaws.com/dev/login',
      postData
    );
  }
}
