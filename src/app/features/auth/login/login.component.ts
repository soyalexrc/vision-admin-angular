import {Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  passwordVisible = false;
  password: any;
  username: any;
  remember= false

  constructor(
    private router: Router,
    private auth: AuthService,
    private message: NzMessageService,
    private userService: UserService,
  ) {}
  ngOnInit() {
    if (localStorage.getItem('vi-remember')) {
      this.username = localStorage.getItem('vi-username')
      this.remember = true;
    }
  }

  login() {
    if (!this.username) {
      this.message.create('error', 'ingresa un usuario')
      return;
    }
    if (!this.password) {
      this.message.create('error', 'ingresa una contrasena')
      return;
    }

    this.auth.login(this.username, this.password, this.remember).subscribe(data => {
      // this.auth.setToken(data.id_token)
      this.userService.updateCurrentUser(data.recordset[0]);
      this.router.navigate(['/'])
      this.showMessage('success', `Bienvenid@, ${this.username}`)

    }, error => {
      this.showMessage('error', (error.error.detail || 'Ocurrio un error inesperado, por favor prueba mas tarde...'))
    })
  }

  showMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  handleRememberChange(event: any) {
    if (event) {
      localStorage.setItem('vi-remember', event);
      localStorage.setItem('vi-username', this.username);
    } else {
      localStorage.removeItem('vi-remember');
      localStorage.removeItem('vi-username');
    }
  }
}
