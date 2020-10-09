import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Review } from './review-page-review.model';
import { ReviewsService } from './review-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private reviewsService: ReviewsService,
    private router: Router
  ) {}

  review: Review;
  isFetching = false;

  title: string;
  image: string;
  blurb: string;
  reviewText: string;

  ngOnInit(): void {
    this.fetchReviews('http://127.0.0.1:3000' + this.router.url);
  }

  private fetchReviews(url) {
    this.reviewsService.fetchReview(url).subscribe((fetchedReview) => {
      this.isFetching = false;

      this.title = fetchedReview.title;
      this.image = fetchedReview.image;
      this.blurb = fetchedReview.blurb;
      this.reviewText = fetchedReview.review;
    });
  }
}
