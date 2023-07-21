import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CreationUserResponse, GetOneUserResponse, User, UserToCreate, DeleteOneResponse} from "../interfaces/user";

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
    localStorage.setItem('vi-currentUser', JSON.stringify(data));
    this.currentUser.next(data);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('user/getAllData')
  }

  createOne(owner: UserToCreate): Observable<CreationUserResponse> {
    return this.http.post<CreationUserResponse>('user/addNewData', owner)
  }

  deleteOne(id: number): Observable<DeleteOneResponse> {
    return this.http.delete<DeleteOneResponse>(`user/deleteData?id=${id}`);
  }

  getById(id: string): Observable<GetOneUserResponse> {
    return this.http.get<GetOneUserResponse>(`user/getById?id=${id}`)
  }

  update(data: User): Observable<UserToCreate> {
    return this.http.put<UserToCreate>(`user/updateData`, data);
  }
}
