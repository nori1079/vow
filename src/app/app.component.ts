import { Component } from '@angular/core';
import { SessionService } from './core/service/session.service';

@Component({
  selector: 'app-root',
  template: `
     <app-header></app-header> <!--追加-->
    <router-outlet></router-outlet> <!--変更-->
  `,
})
export class AppComponent {

  constructor(
    private session: SessionService) {
    this.session.checkLogin();
  }

}
