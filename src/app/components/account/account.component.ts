import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  gamesWon: number;
  gamesLost: number;
  playersWon = [];
  playersLost = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((doc) => {
      this.gamesWon = doc.timesWon;
      this.gamesLost = doc.timesLost;

      for (let i = 0; i < doc.playersWon.length; i++) {
        if (!this.playersWon.includes(doc.playersWon[i])) {
          this.playersWon.push(doc.playersWon[i]);
        }
      }

      for (let i = 0; i < doc.playersLost.length; i++) {
        if (!this.playersLost.includes(doc.playersLost[i])) {
          this.playersLost.push(doc.playersLost[i]);
        }
      }
    });
  }
}
