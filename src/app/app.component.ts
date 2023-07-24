import { Component } from '@angular/core';
import 'moment/locale/es-us.js'
import * as moment from 'moment';

moment.locale('es-us')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin-angular';
}
