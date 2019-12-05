import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // 追加
import { Router } from '@angular/router'; // 追加
import { Password } from '../../class/chat';
import { Session } from '../../class/chat';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public session = new Session();
  public sessionSubject = new Subject<Session>(); // 追加
  public sessionState = this.sessionSubject.asObservable(); // 追加

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) { } // 追加

  login(account: Password): void { // 変更
    this.afAuth
      .auth
      .signInWithEmailAndPassword(account.email, account.password)
      .then(auth => {
        // メールアドレス確認が済んでいるかどうか
        if (!auth.user.emailVerified) {
          this.afAuth.auth.signOut();
          return Promise.reject('メールアドレスが確認できていません。');
        } else {
          this.session.login = true;
          this.sessionSubject.next(this.session);
          return this.router.navigate(['/']);
        }
      })
      .then(() => alert('ログインしました。'))
      .catch(err => {
        console.log(err);
        alert('ログインに失敗しました。\n' + err);
      });
  }

  logout(): void {// 変更
    this.afAuth
      .auth
      .signOut()
      .then(() => {
        this.sessionSubject.next(this.session.reset());
        return this.router.navigate(['/account/login']);
      })
      .then(() => alert('ログアウトしました。'))
      .catch(err => {
        console.log(err);
        alert('ログアウトに失敗しました。\n' + err);
      });
  }

  // アカウント作成
  signup(account: Password): void { // 追加
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(account.email, account.password) // アカウント作成
      .then(auth => auth.user.sendEmailVerification()) // メールアドレス確認
      .then(() => alert('メールアドレス確認メールを送信しました。'))
      .catch(err => {
        console.log(err);
        alert('アカウントの作成に失敗しました。\n' + err);
      });
  }

}
