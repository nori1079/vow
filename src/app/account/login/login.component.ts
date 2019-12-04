import { Component, OnInit } from '@angular/core';

import { SessionService } from 'src/app/core/service/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private sessionService: SessionService) { } // 追加

  ngOnInit() { }

  submitLogin() { // 追加
    this.sessionService.login();
  }
}
