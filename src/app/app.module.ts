import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {IconsProviderModule} from "./icons-provider.module";
import {JwtModule} from "@auth0/angular-jwt";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzImageService} from "ng-zorro-antd/image";

registerLocaleData(en);

export function tokenGetter() {
  return localStorage.getItem('vi-token')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    CoreModule,
    IconsProviderModule,
    HttpClientModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // TODO asignar mas urls
        allowedDomains: ["http://localhost:4200"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NzModalService,
    NzNotificationService,
    NzMessageService,
    NzImageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
