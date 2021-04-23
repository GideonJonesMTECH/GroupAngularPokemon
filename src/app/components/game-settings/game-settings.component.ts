import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth.service';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
})
export class GameSettingsComponent implements OnInit {
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private authService: AuthService,
    private currentUserService: CurrentUserService
  ) {}

  selectedDifficulty = false;
  selectedPlayers = false;

  infoForm: FormGroup;
  playerForm: FormGroup;

  usersArr;
  currentUserId;

  ngOnInit(): void {
    this.infoForm = new FormGroup({
      playerCount: new FormControl(),
      difficulty: new FormControl(),
      cards: new FormControl(),
    });
    this.playerForm = new FormGroup({
      playerArr: new FormControl(),
    });

    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((val) => {
        this.usersArr = val;
      });

    this.currentUserId = this.currentUserService.getUser();
    console.log(this.currentUserId);
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

  onSpecificPlayerSelect() {
    var checkBoxGroup = document.forms['form_name']['check[]'];
    var limit = document.getElementById('playerCount');
    for (var i = 0; i < checkBoxGroup.length; i++) {
      checkBoxGroup[i].onclick = function () {
        var checkedcount = 0;
        for (var i = 0; i < checkBoxGroup.length; i++) {
          checkedcount += checkBoxGroup[i].checked ? 1 : 0;
        }
        if (checkedcount > limit) {
          console.log('You can select maximum of ' + limit + ' checkboxes.');
          alert('You can select maximum of ' + limit + ' checkboxes.');
          this.checked = false;
        }
      };
    }
  }
}
