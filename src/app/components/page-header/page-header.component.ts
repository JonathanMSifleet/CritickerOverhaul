import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../pages/auth/auth.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  // inject auth service rather than create new instance:
  constructor(public authService: AuthService) {}

  loggedInUsername: string;

  ngOnInit(): void {
    this.authService.loggedInUsername.subscribe(data => {
      this.loggedInUsername = data;
    });

    // load username from local storage if user refreshes
    if (this.loggedInUsername === undefined) {
      this.loggedInUsername = localStorage.getItem('loggedInUsername');
    }
  }

}
