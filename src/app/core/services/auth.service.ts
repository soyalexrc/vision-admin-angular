import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Login} from "../interfaces/login";
import {locale} from "moment/moment";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService,
  ) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('vi-token');
    // Check whether the token is expired and return
    // true or false
    return this.validateSession();
  }

  decodeToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  login(username: string, password: string, remember: boolean): Observable<Login> {
    return this.http.get<Login>(`user/login?email=${username}`)
  }
  logout(){
    this.router.navigate(['/']);
    localStorage.removeItem('vi-token');
    this.message.create('error', 'Su session ha vencido, inicia session de nuevo!')
    return
  }

  validateSession(): boolean {
    const user = localStorage.getItem('vi-token') ? JSON.parse(localStorage.getItem('vi-token') ?? '') : null;

    if (!user) {
      this.logout();
      return false;
    } else {
      const exp = user.exp;
      const dateNow = new Date();
      if (dateNow > new Date(exp * 1000)) {
        this.logout();
        return false;
      } else {
        return true;
      }
    }

  }

  // isBoss() {
  //   return this.getTokenDecoded()?.auth.includes('SERVICIO');
  // }
  //
  // isAdmin() {
  //   return this.getTokenDecoded()?.auth.includes('ADMIN');
  // }

}
