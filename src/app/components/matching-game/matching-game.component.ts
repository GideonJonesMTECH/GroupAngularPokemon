import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiReturn } from 'src/app/interfaces/api-return';
import { ApiCallService } from 'src/app/services/api-call.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-matching-game',
  templateUrl: './matching-game.component.html',
  styleUrls: ['./matching-game.component.scss'],
})
export class MatchingGameComponent implements OnInit {
  formReturn;

  constructor(
    private api: ApiCallService,
    private router: Router,
    private authService: AuthService
  ) {
    this.formReturn = this.router.getCurrentNavigation().extras.state.data;
  }

  matchCount = 5;
  matchingCards = [];
  badCards = 0;
  duplicateCards = 0;
  playerArr = [];
  roundNumb = 1;
  matchesRemaining = this.matchCount;
  currentPlayer = 0;
  selectedCards = [];
  matchedCards = [];
  winningPlayer = {};

  ngOnInit(): void {
    console.log(this.formReturn);
    this.matchCount = (this.formReturn.difficulty as unknown) as number;
    this.matchesRemaining = this.matchCount;

    let pageNumb = 1;
    if (this.formReturn.cards === null) {
      console.log('Randomly generating page numb');
      pageNumb = this.generateRandomNumber(1, 54);
    } else {
      pageNumb = this.formReturn.cards;
    }
    this.api.apiCall((pageNumb as unknown) as string).subscribe((data) => {
      console.warn('get API data', data);
      let returnData = data as ApiReturn;
      this.setup(returnData.data);
    });
    for (let i = 0; i < this.formReturn.playerCount; i++) {
      this.playerArr.push({ name: `Dummy${i}`, score: 0 });
    }
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
          if (document.getElementById(`lrg${i}`))
            document.getElementById(`lrg${i}`).style.opacity = '0';
        }
        this.changeTurn();
      }, 500);
    }
  }

  changeTurn() {
    if (this.matchesRemaining == 0) {
      let i = this.indexOfMax(this.playerArr);
      this.winningPlayer = this.playerArr[i];
      this.endGame(i, [...this.playerArr]);
    } else {
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

  indexOfMax(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0].score;
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i].score > max) {
        maxIndex = i;
        max = arr[i].score;
      }
    }

    return maxIndex;
  }

  endGame(winningPlayerIndex, losingPlayers) {
    console.log(`The Winner`, this.winningPlayer);
    if (winningPlayerIndex == 0) {
      losingPlayers.shift();
    } else {
      losingPlayers.splice(winningPlayerIndex, 1);
    }
    console.log(`The Losers:`, losingPlayers);

    // this.authService.updateStats(this.winningPlayer.uid, true, losingPlayers);
    for (let i = 0; i < losingPlayers.length; i++) {
      let playersAgainst = [...losingPlayers];
      if (i == 0) {
        playersAgainst.shift();
        playersAgainst.push(this.winningPlayer);
      } else {
        playersAgainst.splice(i, 1, this.winningPlayer);
      }
      console.log(losingPlayers[i]);
      console.log('vs');
      console.log(playersAgainst);
      //this.authService.updateStats(losingPlayers[i].uid, false, otherPlayers, this.winningPlayer.name)
    }
    //call update stats from auth.service
  }
}
