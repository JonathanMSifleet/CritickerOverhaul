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
  ) {}

  error = '';

  ngOnInit(): void {
    this.deleteAccount();
  }

  deleteAccount(): void {
    try {
      this.deleteService
        .deleteAccount()
        .pipe(take(1))
        .subscribe(
          () => {
            this.authService.updateUserData(null);
            sessionStorage.removeItem('loggedInUserData');
            this.router.navigate(['']);
          },
          (errorRes) => {
            this.error = errorRes.error.error;
          }
        );
    } catch (e) {
      this.error = 'Unauthorised action. Please use a valid token.';
    }
  }
}
