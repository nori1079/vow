import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
     <app-header></app-header> <!--追加-->
    <router-outlet></router-outlet> <!--変更-->
  `,
})
export class AppComponent {

  constructor() { }

}
