import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Review } from './home-review.model';
import { ReviewsService } from './reviews.service';
import { GlobalVariables } from './../../common/global-variables';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadedReviews: Review;
  globals: GlobalVariables;

  constructor(
    globals: GlobalVariables,
    private http: HttpClient,
    private reviewsService: ReviewsService
  ) {

    this.globals = globals;


  }

  ngOnInit() {
    console.log('global username',this.globals.getLoggedInUsername());
    this.fetchReviews();
  }

  private fetchReviews(): void {
    this.reviewsService.fetchReviews().subscribe((reviews) => {
      this.loadedReviews = reviews;
    });
  }
}
