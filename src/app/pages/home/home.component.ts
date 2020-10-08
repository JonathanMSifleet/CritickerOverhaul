import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Review } from './review.model';
import { ReviewsService } from './reviews.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tempLoadedReviews: Review[] = []; // store reviews here
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
      this.isFetching = false;
      this.tempLoadedReviews = reviews;

      // ignore this error:
      this.loadedReviews = this.tempLoadedReviews[0].data;
      this.tempLoadedReviews = undefined;

      console.log(this.loadedReviews);
    });
  }
}
