import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeleteService {
  constructor(private http: HttpClient) {}

  deleteAccount(): Observable<object> {
    return this.http.delete(
      'https://lvsrmt8ev9.execute-api.eu-west-2.amazonaws.com/dev/deleteAccount'
    );
  }
}
