import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {AuthService} from "../services/auth.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const apiReq = request.clone({
      url: `${environment.apiUrl}/${request.url}` ,
      headers: request.headers.set('Authorization', `Bearer ${this.authService.getToken() }`)
    });

    return next.handle(apiReq);
  }
}
