import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './review.model';
import { map } from 'rxjs/operators';
import { response } from 'express';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  fetchReviews() {
    return this.http
      .get<{ [key: string]: Review }>(
        'http://127.0.0.1:3000/review/getAllReviews'
      )
      .pipe(
        map((responseData) => {
          const reviewArray: Review[] = [];
          for (const key in responseData.data) {
            if (responseData.hasOwnProperty(key)) {
              reviewArray.push({ ...responseData[key], _id: key }); // spread
            }
          }
          return reviewArray;
        })
      );
  }
}
