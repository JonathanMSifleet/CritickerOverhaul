import { AuthService } from './../../pages/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.signOut();
  }

  private signOut(): void {
    this.authService.updateUserData(null);

    sessionStorage.removeItem('loggedInUserData');

    this.router.navigate(['']);
  }
}
