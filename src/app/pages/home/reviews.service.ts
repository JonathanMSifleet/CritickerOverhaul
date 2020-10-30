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
        'http://127.0.0.1:3000/review/getAllReviews'
      )
      .pipe(
        map((responseData) => {
          return responseData.data;
        })
      );
  }
}
