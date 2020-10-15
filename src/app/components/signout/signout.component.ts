import { SignoutService } from './signout.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(
    private signoutService: SignoutService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.signOut();
  }

  private signOut(): void {
    this.signoutService.signout().subscribe(responseData => {
      this.router.navigate(['']);
    });
  }

}
