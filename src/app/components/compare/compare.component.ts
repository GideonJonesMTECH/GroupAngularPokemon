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
  playersWon;
  playersLost;

  constructor(
    private currentUserServe: CurrentUserService,
    public authService: AuthService
  ) { }

  user;

  ngOnInit(): void {
    this.user = this.authService.getUserById(this.currentUserServe.getUser());
    this.authService.user$.subscribe(doc => {
      this.gamesWon = doc.timesWon;
      this.gamesLost = doc.timesLost;
      this.playersWon = doc.playersWon;
      this.playersLost = doc.playersLost;
    })
  }

}
