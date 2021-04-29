import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiReturn } from 'src/app/interfaces/api-return';
import { ApiCallService } from 'src/app/services/api-call.service';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';

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
    private authService: AuthService,
    private currentUserService: CurrentUserService
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
  winningPlayer = { name: '', score: 0, uid: '' };

  playingPlayers = [];

  async ngOnInit(): Promise<void> {
    this.matchCount = (this.formReturn.difficulty as unknown) as number;
    this.matchesRemaining = this.matchCount;

    let pageNumb = 1;
    if (this.formReturn.cards === null) {
      pageNumb = this.generateRandomNumber(1, 54);
    } else {
      pageNumb = this.formReturn.cards;
    }
    this.api.apiCall((pageNumb as unknown) as string).subscribe((data) => {
      let returnData = data as ApiReturn;
      this.setup(returnData.data);
    });
    let currentUser = await this.authService.getUserById(
      this.currentUserService.getUser()
    );
    this.playerArr.push({
      name: currentUser.displayName,
      score: 0,
      uid: currentUser.uid,
    });
    if (this.formReturn.playerCount > 1) {
      for (let i = 0; i < this.formReturn.players.length; i++) {
        let userData = await this.authService.getUserById(
          this.formReturn.players[i]
        );
        this.playerArr.push({
          name: userData.displayName,
          score: 0,
          uid: userData.uid,
        });
      }
    }

    this.playingPlayers = [...this.playerArr];
  }

  setup(data) {
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
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
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

        this.playingPlayers[this.currentPlayer].score++;
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
      let i = this.indexOfMax(this.playingPlayers);
      if (i.length > 1) {
        this.winningPlayer = this.playingPlayers[i[0]];
        this.endGame(i[0], [...this.playingPlayers]);
        this.winningPlayer = this.playingPlayers[i[1]];
        this.endGame(i[1], [...this.playingPlayers]);
        this.tieBreaker(i);
      } else {
        this.winningPlayer = this.playingPlayers[i[0]];
        this.endGame(i[0], [...this.playingPlayers]);
      }
    } else {
      this.currentPlayer++;
      if (this.currentPlayer == this.playingPlayers.length) {
        this.currentPlayer = 0;
        this.roundNumb++;
      }
    }
  }

  indexOfMax(arr) {
    if (arr.length === 0) {
      return [-1];
    }

    var max = arr[0].score;
    var maxIndex = [0];

    for (var i = 1; i < arr.length; i++) {
      if (arr[i].score > max) {
        maxIndex = [i];
        max = arr[i].score;
      } else if (arr[i].score == max) {
        maxIndex.push(i)
      }
    }

    return maxIndex;
  }

  async endGame(winningPlayerIndex, losingPlayers) {

    if (winningPlayerIndex == 0) {
      losingPlayers.shift();
    } else {
      losingPlayers.splice(winningPlayerIndex, 1);
    }

    this.authService.updateStats(
      await this.authService.getUserById(this.winningPlayer.uid),
      true,
      losingPlayers
    );
    for (let i = 0; i < losingPlayers.length; i++) {
      let playersAgainst = [...losingPlayers];
      if (i == 0) {
        playersAgainst.shift();
        playersAgainst.push(this.winningPlayer);
      } else {
        playersAgainst.splice(i, 1, this.winningPlayer);
      }

      if (!losingPlayers[i].guest) {
        this.authService.updateStats(
          await this.authService.getUserById(losingPlayers[i].uid),
          false,
          playersAgainst,
          this.winningPlayer.name
        );
      }
    }
  }

  async tieBreaker(winners) {
    console.log(`Tie! The winners are: ${winners}`);
    let winnerArr = [];
    for (let i = 0; i < winners.length; i++) {
      winnerArr.push(this.playerArr[winners[i]]);      
    }

    this.matchCount = 3;
    this.matchesRemaining = this.matchCount;

    let pageNumb = 1;
    if (this.formReturn.cards === null) {
      pageNumb = this.generateRandomNumber(1, 54);
    } else {
      pageNumb = this.formReturn.cards;
    }
    this.matchingCards = [];
    this.api.apiCall((pageNumb as unknown) as string).subscribe((data) => {
      let returnData = data as ApiReturn;
      this.setup(returnData.data);
    });

    this.playingPlayers = [];
    console.log(this.playerArr);

    for (let i = 0; i < winners.length; i++) {
      let userData = await this.authService.getUserById(
        winnerArr[i].uid
      );
      this.playingPlayers.push({
        name: userData.displayName,
        score: 0,
        uid: userData.uid,
      });
    }
  }
}
