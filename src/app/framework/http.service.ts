import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  doGet(url: string) {
    return this.http.get(`${environment.apiUrl}/${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Over': environment.orgId,
      },
    });
  }

  doPost(url: string, body: any) {
    return this.http.post(
      `${environment.apiUrl}/${url}`,
      JSON.stringify(body),
      {
        headers: {
          'Content-Type': 'application/json',
          'Content-Over': environment.orgId,
        },
      }
    );
  }
}
