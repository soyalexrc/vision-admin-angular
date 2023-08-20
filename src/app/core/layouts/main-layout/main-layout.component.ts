import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {UiService} from "../../services/ui.service";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";
import {User} from "../../interfaces/user";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  user!: Partial<User>;
  isCollapsed = false;
  confirmModal?: NzModalRef; // For testing by now
  visible = false;
  isSmallScreen = window.innerWidth < 900;
  private userSubscription = new Subscription();
  canSeeDashboard!: boolean;

  constructor(
    private auth: AuthService,
    private modal: NzModalService,
    private router: Router,
    private uiService: UiService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.uiService.isLayoutDrawerVisible.subscribe(value => {
      this.visible = value;
    });

    this.userSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;
    })

    window.addEventListener('resize', () => {
      this.isSmallScreen = window.innerWidth < 900;
    })
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => {});
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.confirmModal = this.modal.confirm({
      nzTitle: `Quieres cerrar la sesion?`,
      nzContent: '',
      nzOnOk: () => {
        localStorage.removeItem('vi-token')
        this.router.navigate(['/autenticacion'])
      }
    })
  }

  open(): void {
    this.uiService.showLayoutDrawer();
  }

  close(): void {
    this.uiService.hideLayoutDrawer();
  }

  handleRouting() {
    this.uiService.hideLayoutDrawer();
    // this.router.navigate([route]);
  }

  shortener(st: string) {
    return st.slice(0, 2);
  }

  validateAccess(route: string) {
    return this.userService.checkAllowedRouteByUserRole(route);
  }
}
