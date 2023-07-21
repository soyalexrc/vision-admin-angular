
export interface Ally {
  id:         number;
  first_name: string;
  last_name:  string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
}

export interface AllyToCreate {
  id:         null;
  firstName:   string;
  lastName:   string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
}


export interface CreationAllyResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface GetOneAllyResponse {
  recordsets:   Array<Ally[]>;
  recordset:    Ally[];
  output:       Output;
  rowsAffected: any[];
}


export interface Output {
}

export interface Recordset {
  ID: number;
}

export interface DeleteOneResponse {
  recordsets:   any[];
  output:       Output;
  rowsAffected: number[];
}
