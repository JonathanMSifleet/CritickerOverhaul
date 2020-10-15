import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './../../pages/auth/auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit, OnDestroy {

  // inject auth service rather than create new instance:
  constructor(public authService: AuthService) {}

  loggedInUsername;
  usernameSubscription;

  ngOnInit() {
    this.usernameSubscription = this.authService.loggedInUsername.subscribe((data) => {
      this.loggedInUsername = data;
    });
  }

  ngOnDestroy() {
    this.usernameSubscription.unsubscribe();
  }

}
