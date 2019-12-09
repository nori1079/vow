import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SessionService } from '../service/session.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private session: SessionService,  // 追加
    private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.session // 変更
      .checkLoginState()
      .pipe(
        map(session => {
          // ログインしていない場合はログイン画面に遷移
          if (!session.login) {
            this.router.navigate(['/account/login']);
          }
          return session.login;
        })
      );
  }
}
