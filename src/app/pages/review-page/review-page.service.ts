import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './review-page-review.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  fetchReview(url: string) {
    return this.http.get<{ [key: string]: Review }>(url).pipe(
      map((responseData) => {
        for (const key in responseData.data) {
          if (responseData.hasOwnProperty(key)) {
            return { ...responseData[key], title: key }; // return first object as only one response should be sent
          }
        }
      })
    );
  }
}
