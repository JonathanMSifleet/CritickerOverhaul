import { Component, OnInit } from '@angular/core';

import { Review } from './home-review.model';
import { ReviewsService } from './reviews.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadedReviews: Review;

  constructor(
    private reviewsService: ReviewsService,
  ) { }

  ngOnInit(): void {
    this.fetchReviews();
  }

  private fetchReviews(): void {
    this.reviewsService.fetchReviews().subscribe((reviews) => {
      this.loadedReviews = reviews;
    });
  }
}
