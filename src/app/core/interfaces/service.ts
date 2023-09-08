import {ServicesService} from "../services/services.service";

export interface Service {
  title: string;
  id?: number;
  subServices?: SubService[]
  updatedAt: Date;
  createdAt: Date;
}

export interface SubService {
  title: string;
  id?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface CreateEditService {
  data: Service,
  message: string
}

export interface ServiceCreate {
  serviceId: null | number;
  serviceTitle: string;
  subServices: Partial<SubService>[]
}
