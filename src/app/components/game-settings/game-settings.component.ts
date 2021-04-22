import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
})
export class GameSettingsComponent implements OnInit {
  constructor(private router: Router) {}

  selectedDifficulty = false;
  selectedPlayers = false;

  infoForm: FormGroup;

  ngOnInit(): void {
    this.infoForm = new FormGroup({
      players: new FormControl(),
      difficulty: new FormControl(),
      cards: new FormControl(),
    });
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
