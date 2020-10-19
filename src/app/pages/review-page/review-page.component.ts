import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReviewsService } from './review-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent implements OnInit, OnDestroy {
  constructor(
    private reviewsService: ReviewsService,
    private router: Router
  ) {}

  gameName: string;
  image: string;
  blurb: string;
  reviewText: string;

  error: string;

  reviewSubscription;

  ngOnInit(): void {
    this.fetchReviews('http://127.0.0.1:3000' + this.router.url);
  }

  ngOnDestroy(): void {
    this.reviewSubscription.unsubscribe();
  }

  private fetchReviews(url): void {
    this.reviewSubscription = this.reviewsService.fetchReview(url).subscribe((fetchedReview) => {
      this.gameName = fetchedReview.gameName;
      this.image = fetchedReview.image;
      this.blurb = fetchedReview.blurb;
      this.reviewText = fetchedReview.review;
    }, errorRes => {
      this.error = errorRes.error.error;
    });
  }
}
