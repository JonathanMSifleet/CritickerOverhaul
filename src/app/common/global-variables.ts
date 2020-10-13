
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariables {
  private loggedInUsername = '';

  public setLoggedInUsername(value: string): void {
    this.loggedInUsername = value;
  }

  public getLoggedInUsername(): string {
    return this.loggedInUsername;
  }
}
