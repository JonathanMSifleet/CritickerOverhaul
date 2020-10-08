import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Review } from './review.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tempLoadedReviews: Review[] = []; // store reviews here
  loadedReviews: Review[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getReviews();
  }

  private getReviews() {
    this.http
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
      )
      .subscribe((reviews) => {
        this.tempLoadedReviews = reviews;

        console.log('shifted array 0th element', this.tempLoadedReviews);

        // ignore this error:
        this.loadedReviews = this.tempLoadedReviews[0].data;

        console.log(this.loadedReviews);
      });
  }
}
