import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly basePath = 'http://dny15158.macincloud.com:8080/api'


  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService,
  ) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('sr-token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  decodeToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  getToken() {
    return localStorage.getItem('sr-token')
  }

  setToken(token: string) {
    return localStorage.setItem('sr-token', token)
  }

  getTokenDecoded() {
    return this.decodeToken(this.getToken() ?? '')
  }

  login(username: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(`${this.basePath}/authenticate`, {username, password, remember})
  }
  logout(){
    this.router.navigate(['/']);
    localStorage.removeItem('sr-token');
    this.message.create('error', 'Su session ha vencido, inicia session de nuevo!')
    return
  }

  validateSession() {
    if (!this.getToken()) {
      this.logout();
      return;
    }
    const {exp} = this.getTokenDecoded();
    const dateNow = new Date();
    if (dateNow > new Date(exp * 1000)) {
      this.logout();
      return;
    } else {
      return
    }
  }

  isBoss() {
    return this.getTokenDecoded()?.auth.includes('SERVICIO');
  }

  isAdmin() {
    return this.getTokenDecoded()?.auth.includes('ADMIN');
  }

}
