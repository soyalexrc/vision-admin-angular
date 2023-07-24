import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  isLayoutDrawerVisible = new BehaviorSubject<boolean>(false);

  constructor(private message: NzMessageService) { }

  showLayoutDrawer() {
    this.isLayoutDrawerVisible.next(true);
  }

  hideLayoutDrawer() {
    this.isLayoutDrawerVisible.next(false);
  }

  createMessage(type: string, content: string): void {
    this.message.create(type, content);
  }



}
