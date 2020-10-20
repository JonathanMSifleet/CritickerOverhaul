import { Component, OnInit } from '@angular/core';
import { ReviewsService } from './review-page.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.css']
})
export class ReviewPageComponent implements OnInit {
  constructor(
    private reviewsService: ReviewsService,
    private router: Router
  ) {}

  gameName: string;
  image: string;
  blurb: string;
  reviewText: string;

  error: string;

  ngOnInit(): void {
    this.fetchReview('http://127.0.0.1:3000' + this.router.url);
  }

  private fetchReview(url): void {
   this.reviewsService.fetchReview(url).pipe(take(1)).subscribe((fetchedReview) => {
      this.gameName = fetchedReview.gameName;
      this.image = fetchedReview.image;
      this.blurb = fetchedReview.blurb;
      this.reviewText = fetchedReview.review;
    }, errorRes => {
      this.error = errorRes.error.error;
    });
  }
}
