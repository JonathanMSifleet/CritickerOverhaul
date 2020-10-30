import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent {
  @Input() title: string;
  @Input() tagline: string;
  @Input() slug: string;
  @Input() image: string;
}
