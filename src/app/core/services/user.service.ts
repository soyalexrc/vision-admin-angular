import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Recordset} from "../interfaces/login";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = new BehaviorSubject<Recordset>(
    localStorage.getItem('vi-currentUser')
      ? JSON.parse(localStorage.getItem('vi-currentUser') ?? '')
      : {}
  )

  constructor() { }

  get getCurrentUser() {
    return this.currentUser.getValue();
  }

  updateCurrentUser(data: Recordset) {
    console.log(data);
    localStorage.setItem('vi-currentUser', JSON.stringify(data));
    this.currentUser.next(data);
  }
}
