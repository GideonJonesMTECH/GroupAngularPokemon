import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
    private currentUserService: CurrentUserService,
    private authService: AuthService
  ) {}

  selectedDifficulty = false;
  selectedPlayers = false;

  infoForm: FormGroup;
  playerForm: FormGroup;

  usersArr;
  currentUserId;
  availablePlayers = 1;
  selectedPlayersNum = 0;

  ngOnInit(): void {
    this.infoForm = new FormGroup({
      playerCount: new FormControl(),
      difficulty: new FormControl(),
      cards: new FormControl(),
      players: new FormControl(),
    });

    this.afs
      .collection('users')
      .valueChanges()
      .subscribe((val) => {
        this.usersArr = val;
      });

    this.currentUserId = this.currentUserService.getUser();
    if (this.currentUserId == null) {
      this.authService.signOut();
    }
  }

  onDifficultySelect() {
    this.selectedDifficulty = true;
  }

  onPlayerSelect() {
    this.selectedPlayers = true;
    this.availablePlayers = this.infoForm.value.playerCount - 1;
  }

  onFormSubmit(formvalue) {
    this.router.navigateByUrl('/game', {
      state: { data: this.infoForm.value },
    });
  }

  onSpecificPlayerSelect() {
    this.selectedPlayersNum++;
  }
}
