export interface Owner {
  id:         number;
  first_name:  string;
  last_name:  string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
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

