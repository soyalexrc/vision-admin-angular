export interface Adviser {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: Date;
}

export interface CreateEditAdviserResponse {
  data: Adviser,
  message: string;
}

export interface GetAllAdvisers {
  count: number;
  rows: Adviser[]
}

export interface AdviserToCreate {
  id: null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthday: Date;
  isInvestor: string;
  type: string;
}


export interface CreationAdviserResponse {
  recordsets: Array<Recordset[]>;
  recordset: Recordset[];
  output: Output;
  rowsAffected: any[];
}

export interface GetOneAdviserResponse {
  recordsets: Array<Adviser[]>;
  recordset: Adviser[];
  output: Output;
  rowsAffected: any[];
}


export interface Output {
}

export interface Recordset {
  ID: number;
}

export interface DeleteOneResponse {
  recordsets: any[];
  output: Output;
  rowsAffected: number[];
}
