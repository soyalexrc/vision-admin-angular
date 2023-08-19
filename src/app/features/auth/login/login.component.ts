import {Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import { NzMessageService } from 'ng-zorro-antd/message';
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../core/interfaces/user";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  passwordVisible = false;
  password: any;
  email: any;
  remember= false

  constructor(
    private router: Router,
    private auth: AuthService,
    private message: NzMessageService,
    private userService: UserService,
    private uiService: UiService
  ) {}
  ngOnInit() {
    if (localStorage.getItem('vi-remember')) {
      this.email = localStorage.getItem('vi-username')
      this.remember = true;
    }
  }

  login() {
    if (!this.email) {
      this.uiService.createMessage('error', 'ingresa un usuario')
      return;
    }
    if (!this.password) {
      this.uiService.createMessage('error', 'ingresa una contrasena')
      return;
    }

    this.auth.login(this.email, this.password, this.remember).subscribe(data => {
      this.userService.updateCurrentUser(data.userData as Partial<User>, data.token);
      this.router.navigate(['/'])
      this.uiService.createMessage('success', `Bienvenid@, ${this.email}`)

    }, (error) => {
      if (error.status !== 403)
      this.uiService.createMessage('error', error.error.message)
    })
  }

  handleRememberChange(event: any) {
    if (event) {
      localStorage.setItem('vi-remember', event);
      localStorage.setItem('vi-username', this.email);
    } else {
      localStorage.removeItem('vi-remember');
      localStorage.removeItem('vi-username');
    }
  }
}
