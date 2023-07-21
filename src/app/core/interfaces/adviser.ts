
export interface Adviser {
  id:         number;
  first_name: string;
  last_name:  string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
}

export interface AdviserToCreate {
  id:         null;
  firstName:   string;
  lastName:   string;
  phone:      string;
  email:      string;
  birthday:   Date;
  isInvestor: string;
  type:       string;
}


export interface CreationAdviserResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface GetOneAdviserResponse {
  recordsets:   Array<Adviser[]>;
  recordset:    Adviser[];
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
