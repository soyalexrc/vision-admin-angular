import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";
import {UiService} from "../services/ui.service";

@Injectable({
  providedIn: 'root'
})
export class RoleBasedGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
    private uiService: UiService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.userService.currentUser?.value?.allowedRoutes?.some(r => r === route.url[0].path)) {
      this.router.navigate(['/inicio'])
      this.uiService.createMessage('warning', 'Estas intentando acceder a una seccion a la que no tienes permiso!')
      return false;
    } else {
      return true
    }
  }

}
