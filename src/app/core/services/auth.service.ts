import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Login} from "../interfaces/login";
import {locale} from "moment/moment";
import {DeleteResult} from "../interfaces/generics";


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
    return !this.jwtHelper.isTokenExpired(token);;
  }

  getToken() {
    return localStorage.getItem('vi-token' ?? '');
  }

  login(email: string, password: string, remember: boolean): Observable<Login> {
    return this.http.post<Login>('auth/login', {email, password})
  }

  forgotPassword(email: string,): Observable<DeleteResult> {
    return this.http.post<DeleteResult>('auth/forgotPassword', {email})
  }

  recoverPassword(email: string, password: string, code: string): Observable<DeleteResult> {
    return this.http.post<DeleteResult>('auth/recoverPassword', {email, password, code})
  }

  logout(){
    this.router.navigate(['/']);
    localStorage.removeItem('vi-token');
    localStorage.removeItem('vi-userData')
    // this.message.create('error', 'Su session ha vencido, inicia session de nuevo!')
    return
  }


  // isBoss() {
  //   return this.getTokenDecoded()?.auth.includes('SERVICIO');
  // }
  //
  // isAdmin() {
  //   return this.getTokenDecoded()?.auth.includes('ADMIN');
  // }

}
