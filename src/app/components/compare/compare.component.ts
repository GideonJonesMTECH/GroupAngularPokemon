import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  searchBarControl = new FormControl('', [Validators.required]);

  gamesWon: number;
  gamesLost: number;
  playersWon = [];
  playersLost = [];

  usersArr;
  user;
  foundUsers;

  constructor(
    private currentUserServe: CurrentUserService,
    public authService: AuthService,
    private afs: AngularFirestore
  ) {}

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

    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((val) => {
        this.usersArr = val;
        console.log(this.usersArr);
      });
  }

  NameSearch() {
    this.foundUsers = [];
    let searchbarEl = document.getElementById(
      'NameSearchBar'
    ) as HTMLInputElement;
    let searchReturn = searchbarEl.value.toLowerCase();
    console.log(searchReturn);

    for (let i = 0; i < this.usersArr.length; i++) {
      if (
        this.usersArr[i].displayName.toLowerCase().includes(searchReturn) &&
        this.usersArr[i] !== this.user
      ) {
        let foundUser = this.usersArr[i];
        let foundWon = [];
        let foundLost = [];
        for (let i = 0; i < foundUser.playersWon.length; i++) {
          if (!foundWon.includes(foundUser.playersWon[i])) {
            foundWon.push(foundUser.playersWon[i]);
          }
        }
        for (let i = 0; i < foundUser.playersLost.length; i++) {
          if (!foundLost.includes(foundUser.playersLost[i])) {
            foundLost.push(foundUser.playersLost[i]);
          }
        }
        foundUser.playersWon = foundWon;
        foundUser.playersLost = foundLost;

        this.foundUsers.push(foundUser);
      }
    }
  }
}
