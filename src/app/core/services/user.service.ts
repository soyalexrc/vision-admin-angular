import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Recordset} from "../interfaces/login";
import {
  Adviser,
  AdviserToCreate,
  CreationAdviserResponse,
  DeleteOneResponse,
  GetOneAdviserResponse
} from "../interfaces/adviser";
import {HttpClient} from "@angular/common/http";
import {GetOneUserResponse, User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = new BehaviorSubject<User>(
    localStorage.getItem('vi-currentUser')
      ? JSON.parse(localStorage.getItem('vi-currentUser') ?? '')
      : {}
  )

  constructor(private http: HttpClient) { }

  get getCurrentUser() {
    return this.currentUser.getValue();
  }

  updateCurrentUser(data: User) {
    console.log(data);
    localStorage.setItem('vi-currentUser', JSON.stringify(data));
    this.currentUser.next(data);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('user/getAllData')
  }

  createOne(owner: AdviserToCreate): Observable<CreationAdviserResponse> {
    return this.http.post<CreationAdviserResponse>('owner/addNewData', owner)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`owner/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneUserResponse> {
    return this.http.get<GetOneUserResponse>(`owner/getById?id=${id}`)
  }

  update(data: Adviser): Observable<AdviserToCreate> {
    return this.http.put<AdviserToCreate>(`owner/updateData`, data);
  }
}
