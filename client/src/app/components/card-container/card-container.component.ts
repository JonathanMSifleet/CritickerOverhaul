import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent implements OnInit {
  @Input() title: string;
  @Input() tagline: string;
  @Input() slug: string;
  @Input() imageToLoad: string;

  ngOnInit(): void {
    const imageUrl =
      'https://review-bucket-w3ygx8fd-dev.s3.eu-west-2.amazonaws.com/';
    this.imageToLoad = `${imageUrl}${this.slug}.jpg`;
  }
}
