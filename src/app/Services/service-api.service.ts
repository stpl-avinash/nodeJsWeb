import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/v1/student/';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService {

  constructor(private http: HttpClient) {}

   get(url:any): Observable<any> {
    return this.http.get(API_URL + url).pipe(map((res) => res));
  }

   postApi(url: string, payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(API_URL + url, payload, { headers }).pipe(
      map((res) => res)  // This maps the response, you can adjust as needed
    );
  }

  updateApi(url: string, payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(API_URL + url, payload, { headers }).pipe(
      map((res) => res)  // This maps the response, you can adjust as needed
    );
  }

  deleteApi(url:any): Observable<any> {
    return this.http.delete(API_URL + url).pipe(map((res) => res));
  }


}
