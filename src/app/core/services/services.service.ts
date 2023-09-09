import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CreateEditService, Service, ServiceCreate, SubService} from "../interfaces/service";
import {DeleteResult} from "../interfaces/generics";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(
    private  http: HttpClient
  ) { }

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>('service')
  }

  getAllSubService(): Observable<SubService[]> {
    return this.http.get<SubService[]>('service/subService')
  }

  createService(data: ServiceCreate): Observable<CreateEditService> {
    return this.http.post<CreateEditService>('service', data)
  }

  updateService(data: ServiceCreate): Observable<CreateEditService> {
    return this.http.put<CreateEditService>(`service/${data.serviceId}`, data)
  }

  getSubServicesByServiceId(serviceId: number): Observable<SubService[]> {
    return this.http.get<SubService[]>(`service/getSubServicesByServiceId/${serviceId}`)
  }

  deleteSubService(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`service/deleteSubService/${id}`);
  }

}
