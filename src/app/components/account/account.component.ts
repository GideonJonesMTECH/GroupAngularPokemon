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
  playersWon;
  playersLost;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(doc => {
      this.gamesWon = doc.timesWon;
      this.gamesLost = doc.timesLost;
      this.playersWon = doc.playersWon;
      this.playersLost = doc.playersLost;
    })
  }
}
