import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  usersArr;
  topPlayers;

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((val) => {
        this.usersArr = val;
        this.topPlayers = this.usersArr.sort((a, b) => a.timesWon - b.timesWon).reverse().slice(0, 5);
      });
  }

}
