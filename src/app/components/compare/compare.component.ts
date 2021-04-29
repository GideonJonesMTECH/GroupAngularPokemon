import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  gamesWon: number;
  gamesLost: number;
  playersWon = [];
  playersLost = [];

  constructor(
    private currentUserServe: CurrentUserService,
    public authService: AuthService
  ) { }

  user;

  ngOnInit(): void {
    this.authService.user$.subscribe(doc => {
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
    })
  }

}
