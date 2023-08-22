export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthdate: Date;
  property_id: null | number;
  isInvestor: boolean;
}

export interface GetAllOwners {
  count: number;
  rows: Owner[]
}

export interface CreateEditOwnerResponse {
  data: Owner,
  message: string;
}

export interface OwnerToCreate {
  id:         null;
  firstName:   string;
  lastName:   string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
}

export interface DeleteOneResponse {
  recordsets:   any[];
  output:       Output;
  rowsAffected: number[];
}

export interface GetOneOwnerResponse {
  recordsets:   Array<Owner[]>;
  recordset:    Owner[];
  output:       Output;
  rowsAffected: any[];
}

export interface CreationOwnerResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface Output {
}

export interface Recordset {
  ID: number;
}

