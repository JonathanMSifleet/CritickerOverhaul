import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './review-page-review.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  fetchReview(slug: string) {
    return this.http
      .get<{ [key: string]: Review }>(
        'https://lvsrmt8ev9.execute-api.eu-west-2.amazonaws.com/dev/review/' +
          slug
      )
      .pipe(
        map((responseData) => {
          return responseData;
        })
      );
  }
}
