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
  trainerCards = true;

  ngOnInit(): void {
    if (this.trainerCards) {
      this.api
        .apiCall((this.generateRandomNumber(1, 54) as unknown) as string, true)
        .subscribe((data) => {
          console.warn('get API data', data);
          let returnData = data as ApiReturn;
          this.setup(returnData.data);
        });
    } else {
      this.api.apiCall().subscribe((data) => {
        console.warn('get API data', data);
        let returnData = data as ApiReturn;
        this.setup(returnData.data);
      });
    }
  }

  setup(data) {
    console.log(`Match Amount: ${this.matchCount}`);
    console.log(`Card Amount: ${this.matchCount * 2}`);
    let dataLength = data.length - 1;
    for (let i = 0; i < this.matchCount; i++) {
      console.log(data[this.generateRandomNumber(0, dataLength)]);
    }
  }
  generateRandomNumber(min = 0, max = 0) {
    return Math.floor(Math.random() * max + min);
  }
}
