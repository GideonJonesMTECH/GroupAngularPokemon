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

  matchCount = 100;
  matchingCards = [];
  selectedNumbs = [];

  ngOnInit(): void {
    this.api
      .apiCall((this.generateRandomNumber(1, 54) as unknown) as string)
      // .apiCall('54', true) TESTING, SMALLEST DATA POOL
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
    for (let i = 0; i < this.matchCount; i++) {
      this.createNewCard(data, dataLength);
    }
    console.log(`Cards for Matching:`, this.matchingCards);
    let doubleCards = this.matchingCards.concat(this.matchingCards);
    this.matchingCards = this.shuffle(doubleCards);
  }

  generateRandomNumber(min = 0, max = 0) {
    return Math.floor(Math.random() * max + min);
  }

  createNewCard(data, dataLength) {
    let randNumb = this.generateRandomNumber(0, dataLength);
    for (let j = 0; j < this.selectedNumbs.length; j++) {
      if (randNumb == this.selectedNumbs[j]) {
        console.log('FOUND DUPLICATE CARD, RUNNING FUNCTION AGAIN');
        this.createNewCard(data, dataLength);
        return;
      }
    }

    let randomCard = data[randNumb];

    if (
      randomCard.images.large ==
        'https://images.pokemontcg.io/hsp/HGSS18_hires.png' ||
      randomCard.supertype !== 'Pokémon'
    ) {
      console.log('FOUND BAD CARD, RUNNING FUNCTION AGAIN');
      this.createNewCard(data, dataLength);
      return;
    }

    this.selectedNumbs.push(randNumb);

    this.matchingCards.push({
      name: randomCard.name,
      smlImg: randomCard.images.small,
      lrgImg: randomCard.images.large,
      supertype: randomCard.supertype,
    });
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
