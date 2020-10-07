import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  reviews = []; // store reviews here

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews() {
    this.http
      .get('http://127.0.0.1:3000/review/getAllReviews')
      .subscribe((reviews) => {
        console.log(reviews);
      });
  }
}
