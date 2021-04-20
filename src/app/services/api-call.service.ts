import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  constructor(private http: HttpClient) {}

  apiCall(pageNumb = '1', trainerCards = false) {
    if (trainerCards) {
      return this.http.get(
        `https://api.pokemontcg.io/v2/cards?page=${pageNumb}`
      );
    } else {
      return this.http.get(
        `https://api.pokemontcg.io/v2/cards?q=supertype:pokemon`
      );
    }
  }
}
