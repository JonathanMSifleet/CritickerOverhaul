import { DeleteService } from './delete.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  constructor(
    public deleteService: DeleteService,
    public authService: AuthService,
    private router: Router
  ) { }

  error = '';

  ngOnInit(): void {
    this.deleteAccount();
  }

  deleteAccount(): void {

    let token = null;
    try {
      token = JSON.parse(sessionStorage.getItem('loggedInUserData'))._clientToken;
    } catch (e) {}

    if (token) {
      const username = JSON.parse(sessionStorage.getItem('loggedInUserData')).username;

      this.deleteService.deleteAccount(username, token).pipe(take(1)).subscribe(() => {

        sessionStorage.removeItem('loggedInUserData');
        this.authService.updateUserData(null);

        this.router.navigate(['']);
      }, errorRes => {
        this.error = errorRes.error.error;
      });
    } else {
      this.error = 'Unauthorised action. Please use a valid token.';
    }
  }

}
