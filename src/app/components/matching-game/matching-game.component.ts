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

  matchCount = 2;
  matchingCards = [];
  badCards = 0;
  duplicateCards = 0;
  playerArr = [
    { name: 'Gideon', score: 0 },
    { name: 'Sam', score: 0 },
    { name: 'Hayden', score: 0 },
  ];
  roundNumb = 1;
  matchesRemaining = this.matchCount;
  currentPlayer = 0;
  selectedCards = [];
  matchedCards = [];

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
    console.log(
      `Bad Cards: ${this.badCards} || Duplicates: ${this.duplicateCards}`
    );
    let doubleCards = this.matchingCards.concat(this.matchingCards);
    this.matchingCards = this.shuffle(doubleCards);
  }

  createNewCard(data, dataLength) {
    let randNumb = this.generateRandomNumber(0, dataLength);
    let randomCard = data[randNumb];

    if (randomCard.supertype !== 'Pokémon') {
      console.log(
        `FOUND BAD CARD, RUNNING FUNCTION AGAIN. Name: ${randomCard.name}`
      );
      this.badCards++;
      this.createNewCard(data, dataLength);
      return;
    }

    for (let j = 0; j < this.matchingCards.length; j++) {
      if (
        this.matchingCards[j].name.includes(randomCard.name) ||
        randomCard.name.includes(this.matchingCards[j].name)
      ) {
        console.log(
          `FOUND CARD WITH SIMILAR NAME, RUNNING FUNCTION AGAIN. Name: ${randomCard.name} vs ${this.matchingCards[j].name}`
        );
        this.duplicateCards++;
        this.createNewCard(data, dataLength);
        return;
      }
    }
    this.matchingCards.push({
      name: randomCard.name,
      smlImg: randomCard.images.small,
      lrgImg: randomCard.images.large,
      supertype: randomCard.supertype,
      id: randomCard.id,
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

  generateRandomNumber(min = 0, max = 0) {
    return Math.floor(Math.random() * max + min);
  }

  onCardSelect(id, cardNumb) {
    console.log(id);

    for (let i = 0; i < this.matchedCards.length; i++) {
      if (this.matchedCards[0] != null) {
        if (this.matchedCards[i] == id) {
          return;
        }
      }
    }
    if (this.selectedCards[0] != null) {
      if (this.selectedCards[0].numb == cardNumb) {
        return;
      }
    }
    let cardObj = { id: id, numb: cardNumb };
    this.selectedCards.push(cardObj);
    document.getElementById(`lrg${cardNumb}`).style.opacity = '100';

    if (this.selectedCards.length == 2) {
      if (this.selectedCards[0].id == this.selectedCards[1].id) {
        document.getElementById(
          `back${this.selectedCards[0].numb}`
        ).style.opacity = '0';
        document.getElementById(
          `back${this.selectedCards[1].numb}`
        ).style.opacity = '0';
        this.matchesRemaining--;
        this.matchedCards.push(id);

        this.playerArr[this.currentPlayer].score++;
      }

      this.selectedCards = [];
      setTimeout(() => {
        for (let i = 0; i < this.matchingCards.length; i++) {
          document.getElementById(`lrg${i}`).style.opacity = '0';
        }
        this.changeTurn();
      }, 500);
    }
  }

  changeTurn() {
    console.log(
      `${this.playerArr[this.currentPlayer].name} has finished their turn.`
    );
    this.currentPlayer++;
    if (this.currentPlayer == this.playerArr.length) {
      this.currentPlayer = 0;
      this.roundNumb++;
    }
    console.log(
      `${this.playerArr[this.currentPlayer].name} needs to start their turn.`
    );
  }
}
