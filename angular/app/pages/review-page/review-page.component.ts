import { Component, OnInit } from '@angular/core';
import { ReviewsService } from './review-page.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent implements OnInit {
  constructor(
    private reviewsService: ReviewsService
  ) {}

  gameName: string;
  image: string;
  blurb: string;
  reviewText: string;

  error: string;

  ngOnInit(): void {
    // get slug from the end of URL:
    const urlSegments = window.location.pathname.split('/');
    this.fetchReview(urlSegments[urlSegments.length - 1]);
  }

  private fetchReview(slug): void {
   this.reviewsService.fetchReview(slug).pipe(take(1)).subscribe((fetchedReview) => {
    this.extractReviewData(fetchedReview);
    }, errorRes => {
      console.log('error res', errorRes);
      this.error = errorRes.error.error;
    });
  }

  private extractReviewData(fetchedReview) {
    this.gameName = fetchedReview.gameName;
    this.image = fetchedReview.image;
    this.blurb = fetchedReview.blurb;
    this.reviewText = fetchedReview.review;
  }

}
