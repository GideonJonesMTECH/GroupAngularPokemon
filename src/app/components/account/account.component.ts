import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  gamesPlayed = 5;
  gamesWon = 2;
  playersWon = ['Gideon', 'Hayden'];
  playersLost = ['Gideon', 'Hayden'];

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
