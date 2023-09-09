import {Component, OnInit} from '@angular/core';
import 'moment/locale/es-us.js'
import * as moment from 'moment';
import {tz} from 'moment-timezone';

moment.locale('es-us')
tz.setDefault("America/Caracas");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin-angular';
}
