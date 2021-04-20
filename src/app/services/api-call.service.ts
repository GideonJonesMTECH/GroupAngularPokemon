import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  constructor(private http: HttpClient) {}

  apiCall(pageNumb = '1', addition = '') {
    console.log(
      this.http.get(
        `https://api.pokemontcg.io/v2/cards?page=${pageNumb}/${addition}`
      )
    );
    return this.http.get(
      `https://api.pokemontcg.io/v2/cards?page=${pageNumb}/${addition}`
    );
  }
}
