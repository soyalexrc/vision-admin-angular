import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {UiService} from "../services/ui.service";

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private router: Router, private uiService: UiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 404) {
              alert('ocurrio un error 404')
              console.log(err);
            }
            if (err.status === 403) {
              this.uiService.removeSession(err.error.title, err.error.message);
              console.log(err);
            }
            if (err.status === 401) {
              alert('Su session ha vencido')
              this.router.navigate(['/autenticacion']);
              return;
            }

            return
          }
        }
      )
    );
  }
}

