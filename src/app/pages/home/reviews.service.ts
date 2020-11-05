import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './home-review.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  fetchReviews(): Observable<Review> {
    return this.http
      .get<{ [key: string]: Review }>(
        'https://lvsrmt8ev9.execute-api.eu-west-2.amazonaws.com/dev/getreviews'
      )
      .pipe(
        map((responseData) => {
          return responseData.reviews;
        })
      );
  }
}
