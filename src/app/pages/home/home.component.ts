import { Component, OnInit, OnDestroy } from '@angular/core';

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

  reviewSubscription;

  ngOnInit(): void {
    this.fetchReviews();
  }

  onDestroy(): void {
    this.reviewSubscription.unsubscribe();
  }

  private fetchReviews(): void {
    this.reviewSubscription = this.reviewsService.fetchReviews().subscribe((reviews) => {
      this.loadedReviews = reviews;
    });
  }
}
