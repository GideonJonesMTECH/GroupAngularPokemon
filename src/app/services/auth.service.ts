import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private currentUserService: CurrentUserService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.currentUserService.setUser(credential.user);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }

  private async updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const doc = await userRef.ref.get();

    let timesWon;
    let timesLost;
    let playersWon;
    let playersLost;

    if (doc.exists) {
      let invoice = doc.data();
      timesWon = invoice.timesWon;
      timesLost = invoice.timesLost;
      playersWon = invoice.playersWon;
      playersLost = invoice.playersLost;
    } else {
      timesWon = 0;
      timesLost = 0;
      playersWon = [];
      playersLost = [];
    }

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      timesWon: timesWon,
      timesLost: timesLost,
      playersWon: playersWon,
      playersLost: playersLost,
    };

    return userRef.set(data, { merge: true });
  }

  updateStats(user, won, playersAgainst = [], winner = '') {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    let timesWon = user.timesWon;
    let timesLost = user.timesLost;
    let playersWon = user.playersWon;
    let playersLost = user.playersLost;

    if (won) {
      timesWon++;
      for (let i = 0; i < playersAgainst.length; i++) {
        playersWon.push(playersAgainst[i].name);
      }
    } else if (!won) {
      timesLost++;
      playersLost.push(winner);
    }

    const data = {
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      timesWon: timesWon,
      timesLost: timesLost,
      playersWon: playersWon,
      playersLost: playersLost,
    };

    return userRef.set(data, { merge: true });
  }

  async getUserById(userId) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${userId}`
    );

    const doc = await userRef.ref.get();

    if (doc.exists) {
      return doc.data();
    } else {
      console.log('Document does not exist!');
    }
  }
}
