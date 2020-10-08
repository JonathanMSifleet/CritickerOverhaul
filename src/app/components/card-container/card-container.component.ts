import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit {
  constructor() {}

  @Input() title: string;
  @Input() tagline: string;
  @Input() image: string;

  ngOnInit(): void {
    console.log(this.image);
    this.image = this.image + '.jpg';
  }
}
