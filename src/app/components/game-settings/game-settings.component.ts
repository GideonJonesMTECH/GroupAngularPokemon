import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
})
export class GameSettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  selectedDifficulty = false;
  selectedPlayers = false;

  infoForm: FormGroup;

  usersArr;
  currentUser;

  ngOnInit(): void {
    this.infoForm = new FormGroup({
      players: new FormControl(),
      difficulty: new FormControl(),
      cards: new FormControl(),
    });

    this.afs.collection('users').valueChanges()
      .subscribe(val => {
        this.usersArr = val;
      });

    this.currentUser = firebase.auth().currentUser;
    console.log(this.currentUser)
  }

  onSubmit() {
    console.log('Button Works');
  }

  onDifficultySelect() {
    this.selectedDifficulty = true;
    console.log('Difficulty Selected');
    if (this.selectedDifficulty && this.selectedPlayers) {
      let courseButton = document.getElementById('gamePlayButton');
      courseButton.removeAttribute('disabled');
    }
  }

  onPlayerSelect() {
    this.selectedPlayers = true;
    console.log('Players selected');
    if (this.selectedDifficulty && this.selectedPlayers) {
      let courseButton = document.getElementById('gamePlayButton');
      courseButton.removeAttribute('disabled');
    }
  }

  onFormSubmit(formvalue) {
    console.log(formvalue);
    this.router.navigateByUrl('/game', {
      state: { data: this.infoForm.value },
    });
  }
}

// db.collection("cities").where("capital", "==", true)
// .get()
// .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//     });
// })
// .catch((error) => {
//     console.log("Error getting documents: ", error);
// });
