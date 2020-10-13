import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})

export class EventEmitterService {

  invokeUpdateHeader = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onSignIn() {
    this.invokeUpdateHeader.emit();
  }

}
