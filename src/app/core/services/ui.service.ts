import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  isLayoutDrawerVisible = new BehaviorSubject<boolean>(false);

  constructor() { }

  showLayoutDrawer() {
    this.isLayoutDrawerVisible.next(true);
  }

  hideLayoutDrawer() {
    this.isLayoutDrawerVisible.next(false);
  }



}
