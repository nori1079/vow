import { Component, OnInit } from '@angular/core';
import { Password } from '../../class/chat';
import { SessionService } from '../../core/service/session.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  public account = new Password(); // 追加

  constructor(private session: SessionService) { } // 追加

  ngOnInit() {
  }

  // アカウント作成
  submitSignUp(e: Event): void { // 追加
    e.preventDefault();
    // パスワード確認
    if (this.account.password !== this.account.passwordconfirmation) {
      alert('パスワードが異なります。');
      return;
    }
    this.session.signup(this.account);
    this.account.reset();
  }

}
