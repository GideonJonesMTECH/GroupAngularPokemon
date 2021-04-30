import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { AccountComponent } from '../components/account/account.component';
import { CompareComponent } from '../components/compare/compare.component';
import { GameSettingsComponent } from '../components/game-settings/game-settings.component';
import { LeaderboardComponent } from '../components/leaderboard/leaderboard.component';
import { MatchingGameComponent } from '../components/matching-game/matching-game.component';



const routes: Routes = [
  { path: 'game', component: MatchingGameComponent, canActivate: [LoggedInGuard] },
  { path: 'game-settings', component: GameSettingsComponent, canActivate: [LoggedInGuard] },
  { path: 'account', component: AccountComponent },
  { path: 'compare', component: CompareComponent, canActivate: [LoggedInGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [LoggedInGuard] },
  { path: '**', redirectTo: 'account', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
