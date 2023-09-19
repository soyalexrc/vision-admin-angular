import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "./auth.service";
import {CustomBreakpoints} from "../constants/custom-breakpoints";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  currentScreen: BehaviorSubject<CustomBreakpoints> = new BehaviorSubject<CustomBreakpoints>(CustomBreakpoints.INIT)

  isLayoutDrawerVisible = new BehaviorSubject<boolean>(false);

  constructor(
    private message: NzMessageService,
    private modal: NzModalService,
    private authService: AuthService
  ) { }

  showLayoutDrawer() {
    this.isLayoutDrawerVisible.next(true);
  }

  hideLayoutDrawer() {
    this.isLayoutDrawerVisible.next(false);
  }

  createMessage(type: string, content: string): void {
    this.message.create(type, content);
  }

  removeSession(title: string, message: string) {
    this.modal.error({
      nzClosable: false,
      nzCloseIcon: undefined,
      nzTitle: title,
      nzContent: message,
      nzOnOk: () => this.authService.logout()
    })
  }

  updateScreenBreakpoint(value: CustomBreakpoints) {
    this.currentScreen.next(value);
  }

  isPhoneScreen() {
    return this.currentScreen.value === CustomBreakpoints.PHONE
  }
  isFoldScreen() {
    return this.currentScreen.value === CustomBreakpoints.FOLD
  }
  isFoldWrappedScreen() {
    return this.currentScreen.value === CustomBreakpoints.FOLD_WRAPPED
  }
  isTabletScreen() {
    return this.currentScreen.value === CustomBreakpoints.TABLET
  }
  isDesktopScreen() {
    return this.currentScreen.value === CustomBreakpoints.DESKTOP
  }

}
