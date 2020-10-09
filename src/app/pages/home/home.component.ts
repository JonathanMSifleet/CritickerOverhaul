import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Review } from './home-review.model';
import { ReviewsService } from './reviews.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadedReviews: Review[] = [];

  isFetching = false;

  constructor(
    private http: HttpClient,
    private reviewsService: ReviewsService
  ) {}

  ngOnInit() {
    this.fetchReviews();
  }

  private fetchReviews(): void {
    this.reviewsService.fetchReviews().subscribe((reviews) => {
      this.loadedReviews = reviews;
      this.isFetching = false;
    });
  }
}
