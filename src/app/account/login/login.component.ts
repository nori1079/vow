import { Component, OnInit } from '@angular/core';

import { SessionService } from '../../core/service/session.service';
import { Password } from '../../class/chat';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public account = new Password(); // 追加

  constructor(private sessionService: SessionService) { }

  ngOnInit() { }

  submitLogin(e: Event) {
    e.preventDefault();
    this.sessionService.login(this.account); // 変更
  }
}
