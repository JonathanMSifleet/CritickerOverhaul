import { EventEmitterService } from './../../event-emitter/event-emitter.service';
import { GlobalVariables } from './../../common/global-variables';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
  globals: GlobalVariables;

  constructor(globals: GlobalVariables, private eventEmitterService: EventEmitterService) {
    this.globals = globals;
  }

  loggedInUsername = '';
  isLoggedIn = false;

  ngOnInit(): void {
    this.loggedInUsername = this.globals.getLoggedInUsername();
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
      invokeUpdateHeader.subscribe(() => {
        this.updateUsername();
        console.log('username:', this.loggedInUsername);
      });
    }
  }

  updateUsername(): void {
    this.loggedInUsername = this.globals.getLoggedInUsername();
    if(this.loggedInUsername !== '') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

}
