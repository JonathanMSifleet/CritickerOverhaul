import { UserData } from './user-data.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import bcrypt from 'bcryptjs';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  error: string = null;
  friendlyErrors: string[];
  userDataSubscription = null;

  // passing auth service in constructor injects it
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isLoginMode = true;

  ngOnInit(): void {
    this.friendlyErrors = [];
    this.userDataSubscription = this.authService.loggedInUserData.subscribe();
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription !== null) {
      this.userDataSubscription.unsubscribe();
    }
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.friendlyErrors = [];
  }

  signIn(postData): void {
    this.friendlyErrors = [];
    this.authService.signIn(postData).pipe(take(1)).subscribe((responseData) => {
      try {
        // @ts-expect-error
        const { username, email} = responseData;

        const newUserData = new UserData(
          username,
          email
        );

        this.authService.updateUserData(newUserData);
        sessionStorage.setItem('loggedInUserData', JSON.stringify(newUserData));

        this.router.navigate(['']);
      } catch (e ) {
        this.friendlyErrors.push('Incorrect email or password');
      }
    });
  }

  signUp(postData: { username; firstName; email; password; passwordConfirm }): void {
    this.friendlyErrors = [];
    this.validateUserInputs(postData);

    if (this.friendlyErrors.length === 0) {
      postData.password = bcrypt.hashSync(postData.password, 12); // second parameter defines salt rounds

      this.authService.signUp(postData).pipe(take(1)).subscribe(data => {
        console.log('auth component signup data', data);
        this.switchMode();
      }, errorRes => {
        this.error = errorRes.error.error;
      });
    } else {
      this.friendlyErrors.forEach(element => {
        console.error(element);
      });
    }
  }

  private validateUserInputs(postData): void {
      this.validateInput(postData.username, 'Username');
      this.validateInput(postData.firstName, 'First name');
      this.validateInput(postData.email, 'Email');
      this.validateInput(postData.password, 'Password');

      if (postData.password !== postData.passwordConfirm) {
        this.friendlyErrors.push('Passwords do not match');
      }

      // remove 'empty' errors:
      let arrayLength = this.friendlyErrors.length;
      while (arrayLength--) {
        if (this.friendlyErrors[arrayLength] === undefined) { 
          this.friendlyErrors.splice(arrayLength, 1);
        } 
      }
  }

  private validateInput(value, name): void {

    switch (name) {
      case 'Username':
        this.friendlyErrors.push(this.validateNotEmpty(value, name));
        this.friendlyErrors.push(this.validateLength(value, name, 3, 16));
        this.friendlyErrors.push(this.validateAgainstRegex(value, name, /[^A-Za-z0-9]+/, 'cannot contain special characters'));
        break;
      case 'First name':
        this.friendlyErrors.push(this.validateNotEmpty(value, name));
        this.friendlyErrors.push(this.validateLength(value, name, 3, 20));
        this.friendlyErrors.push(this.validateAgainstRegex(value, name, /[^A-Za-z]+/, 'can only contain letters'));
        break;
      case 'Email':
        this.friendlyErrors.push(this.validateNotEmpty(value, name));
        this.friendlyErrors.push(this.validateLength(value, name, 3, 256));
        this.friendlyErrors.push(this.validateIsEmail(value));
        break;
      case 'Password':
        this.friendlyErrors.push(this.validateNotEmpty(value, name));
        this.friendlyErrors.push(this.validateLength(value, name, 8, 64));
        break;
      default:
        this.friendlyErrors.push('Unexpected error');
    }
  }

  private validateNotEmpty(value, name): string {
    if (value === null || value === '' || value === undefined) {
      return `${name} must not be empty`;
    }
  }

  private validateLength(value, name, min, max): string {
    if (value.length < min || value.length > max) {
      return `${name} must be between ${min} and ${max} chracters`;
    }
  }

  private validateAgainstRegex(value, name, regex, message): string {
    if (regex.test(value)) {
      return `${name} ${message}`;
    }
  }

  private validateIsEmail(value): string {
    if (!EmailValidator.validate(value)) {
      return `Email must be valid`;
    }
  }

}
