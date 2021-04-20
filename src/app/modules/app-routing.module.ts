import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { AccountComponent } from '../components/account/account.component';
import { LoginComponent } from '../components/login/login.component';
import { MatchingGameComponent } from '../components/matching-game/matching-game.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'game', component: MatchingGameComponent, canActivate: [LoggedInGuard] },
  { path: 'account', component: AccountComponent, canActivate: [LoggedInGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
