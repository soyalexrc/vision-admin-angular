import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  User, GetAllUsers, CreateEditUserResponse,
} from "../interfaces/user";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser = new BehaviorSubject<Partial<User>>(
    localStorage.getItem('vi-userData')
      ? JSON.parse(localStorage.getItem('vi-userData') ?? '')
      : {}
  )

  constructor(private http: HttpClient) {
  }

  get getCurrentUser() {
    return this.currentUser.getValue();
  }

  updateCurrentUser(data: Partial<User>, token: string) {
    localStorage.setItem('vi-token', token);
    localStorage.setItem('vi-userData', JSON.stringify(data));
    this.currentUser.next(data);
  }

  getAll(pageIndex: number, pageSize: number): Observable<GetAllUsers> {
    return this.http.get<GetAllUsers>(`user?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  }

  createOne(data: User): Observable<CreateEditUserResponse> {
    return this.http.post<CreateEditUserResponse>('user', data)
  }

  deleteOne(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`user/${id}`);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`user/${id}`)
  }

  update(data: User): Observable<CreateEditUserResponse> {
    return this.http.put<CreateEditUserResponse>(`user/${data.id}`, data);
  }

  checkAllowedRouteByUserRole(route: string) {
    return this.currentUser.value?.allowedRoutes?.some(r => r === route)
  }
}
