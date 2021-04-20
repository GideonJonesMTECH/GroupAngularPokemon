import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../components/account/account.component';
import { LoginComponent } from '../components/login/login.component';
import { MatchingGameComponent } from '../components/matching-game/matching-game.component';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'game', component: MatchingGameComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
