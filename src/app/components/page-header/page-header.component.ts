import { UserData } from './../../pages/auth/user-data.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../pages/auth/auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit, OnDestroy {

  // inject auth service rather than create new instance:
  constructor(public authService: AuthService) {}

  loggedInUserData: UserData;
  userDataSubscription = null;

  ngOnInit(): void {
    this.userDataSubscription = this.authService.loggedInUserData.subscribe(data => {
      this.loggedInUserData = data;
    });

    // load username from local storage if user refreshes
    if (this.loggedInUserData === null) {
      this.loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInUserData'));
    }
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription !== null) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
