import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UiService {

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

  removeSessionFromInactive(title: string, message: string) {
    this.modal.error({
      nzClosable: false,
      nzCloseIcon: undefined,
      nzTitle: title,
      nzContent: message,
      nzOnOk: () => this.authService.logout()
    })
  }



}
