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

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    let timesWon;
    let timesLost;
    let playersWon;
    let playersLost;

    user.timesWon == null ? (timesWon = 0) : (timesWon = user.timesWon);
    user.timesLost == null ? (timesLost = 0) : (timesLost = user.timesLost);
    user.playersWon == null
      ? (playersWon = [])
      : (playersWon = user.playersWon);
    user.playersLost == null
      ? (playersLost = [])
      : (playersLost = user.playersLost);

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
    let invoice;
    userRef.ref.get().then((doc) => {
      if (doc.exists) {
        invoice = doc.data();
      } else {
        console.error('No matching invoice found');
      }
    });

    let timesWon = invoice.timesWon;
    let timesLost = invoice.timesLost;
    let playersWon = invoice.playersWon;
    let playersLost = invoice.playersLost;

    if (won) {
      timesWon++;
      playersWon.push(...playersAgainst);
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

  getUserById(userId) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${userId}`
    );

    userRef.ref.get().then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        return doc.data();
      } else {
        console.error('No matching invoice found');
      }
    });
  }
}
