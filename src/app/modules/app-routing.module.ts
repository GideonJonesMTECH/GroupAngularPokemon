import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchingGameComponent } from '../components/matching-game/matching-game.component';

const routes: Routes = [
  { path: '', redirectTo: 'game', pathMatch: 'full' },
  { path: 'game', component: MatchingGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
