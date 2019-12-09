import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './store/effects/session.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([SessionEffects]),
    StoreDevtoolsModule.instrument({ // 追加
      maxAge: 25, // stateの上限を設定
      logOnly: environment.production, // 開発環境でのみ動作するよう制限
    }),
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [
    HeaderComponent,
  ]
})
export class CoreModule {

  constructor(
    @Optional()
    @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
