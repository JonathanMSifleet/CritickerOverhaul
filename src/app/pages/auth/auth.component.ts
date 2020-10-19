import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  error: string = null;
  unfriendlyErrors: string[];
  friendlyErrors = [];

  usernameSubsciption;
  signinSubscription;
  signupSubscription;

  // passing auth service in constructor injects it
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isLoginMode = true;

  ngOnInit(): void {
    this.usernameSubsciption = this.authService.loggedInUsername.subscribe(data => {});
  }

  ngOnDestroy(): void {
    this.usernameSubsciption.unsubscribe();
    this.signinSubscription.unsubscribe();
    this.signupSubscription.unsubscribe();
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.friendlyErrors = [];
  }

  signIn(postData): void {
    this.friendlyErrors = [];
    this.signinSubscription = this.authService.signIn(postData).subscribe((responseData) => {
      // @ts-expect-error
      this.setUsername(responseData.user.username);
      this.router.navigate(['']);
    }, errorRes => {
      this.friendlyErrors.push(errorRes.error.error);
    });
  }

  signUp(postData: { username; firstName; email; password }): void {
    this.signupSubscription = this.authService.signUp(postData).subscribe((responseData) => {
      this.switchMode();
    }, errorRes => {
      this.friendlyErrors = [];
      this.error = errorRes.error.error;
      this.handleErrors();
    });
  }

  setUsername(username: string): void {
    this.authService.updateUsername(username);
    localStorage.setItem('loggedInUsername', username);
  }

  private handleErrors(): void {
    this.unfriendlyErrors = this.error.split(',');

    this.unfriendlyErrors.forEach(element => {
      // first two ifs required as mongoose
      // database message requires separate handling:
      if (element.includes('email_1 dup key')) {
        this.friendlyErrors.push('Email address already in use');
      } else if (element.includes('username dup key')){
        this.friendlyErrors.push('Username already in use');
      } else {
        this.friendlyErrors.push(this.createUserFriendlyErrMessage(element));
      }
    });
  }

  private createUserFriendlyErrMessage(message): string {
    switch (true) {
      case message.includes('USERNAME REQUIRED'):
      return 'Username field must not be empty';
      case message.includes('USERNAME TOO LONG'):
      return 'Username must be between 3 and 20 chracters';
      case message.includes('USERNAME TOO SHORT'):
      return 'Username must be between 3 and 20 chracters';
      case message.includes('USERNAME MUST BE ALPHANUMERIC'):
      return 'Username cannot contain special characters, only A-Z, 0-9';
      case message.includes('NAME REQUIRED'):
      return 'First name field must not be empty';
      case message.includes('NAME TOO LONG'):
      return 'First name must be between 3 and 16 characters';
      case message.includes('NAME TOO SHORT'):
      return 'First name must be between 3 and 16 characters';
      case message.includes('NAME MUST CONTAIN ONLY CHARACTERS'):
      return 'First name can only contain characters in the alphabet';
      case message.includes('EMAIL REQUIRED'):
      return 'Emaill field must not be empty';
      case message.includes('INVALID EMAIL'):
      return 'Please enter a valid email address';
      case message.includes('PASSWORD TOO LONG'):
      return 'Password must be between 8 and 64 characters';
      case message.includes('PASSWORD TOO SHORT'):
      return 'Password must be between 8 and 64 characters';
      case message.includes('PASSWORD REQUIRED'):
      return 'Password field must not be empty';
      case message.includes('CONFIRMATION PASSWORD TOO SHORT'):
      return 'Password must be between 8 and 64 characters';
      case message.includes('CONFIRMATION PASSWORD TOO LONG'):
      return 'Password must be between 8 and 64 characters';
      case message.includes('CONFIRMATION PASSWORD REQUIRED'):
      return ' Confirmation password field must not be empty';
      case message.includes('PASSWORDS DO NOT MATCH'):
      return 'Passwords do not match';
      default:
      return 'Unhandled error, please contact support with steps to reproduce';
    }
  }
}
