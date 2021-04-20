import { Component, OnInit } from '@angular/core';
import { ApiReturn } from 'src/app/interfaces/api-return';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-matching-game',
  templateUrl: './matching-game.component.html',
  styleUrls: ['./matching-game.component.scss'],
})
export class MatchingGameComponent implements OnInit {
  constructor(private api: ApiCallService) {}

  matchCount = 5;

  ngOnInit(): void {
    this.api
      .apiCall((this.generateRandomNumber(1, 54) as unknown) as string)
      .subscribe((data) => {
        console.warn('get API data', data);
        let returnData = data as ApiReturn;
        this.setup(returnData.data);
      });
  }

  setup(data) {
    console.log(`Match Amount: ${this.matchCount}`);
    console.log(`Card Amount: ${this.matchCount * 2}`);
    let dataLength = data.length - 1;
    for (let i = 0; i++; i < this.matchCount) {
      let pokemonNumb = this.generateRandomNumber(0, dataLength);
      console.log(pokemonNumb);
    }
  }

  generateRandomNumber(min = 0, max = 0): Number {
    return Math.floor(Math.random() * max + min);
  }
}
