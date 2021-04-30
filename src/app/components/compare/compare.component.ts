import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  searchBarControl = new FormControl('', [
    Validators.required
  ]);

  gamesWon: number;
  gamesLost: number;
  playersWon = [];
  playersLost = [];

  usersArr;
  user;

  constructor(
    private currentUserServe: CurrentUserService,
    public authService: AuthService,
    private afs: AngularFirestore
  ) { }

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

    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((val) => {
        this.usersArr = val;
        console.log(this.usersArr);
      });
  }
}