import {PropertyFull, PropertyReview} from "./property";
import {Owner} from "./owner";
import {Client} from "./client";
import {User} from "./user";

export interface CustomProperty extends PropertyReview {
  property_type: string;
  operation_type: string;
}

export interface CashFlowRegister {
  id: number;
  client_id: number | null;
  owner_id: number | null;
  cashflow_person_id: number | null;
  person: any;
  property_id: number | null;
  canon?: string;
  guarantee?:  string;
  internalProperty?:  string;
  contract?:  string;
  taxPayer?: string;
  month: string;
  date: Date | string;
  property?: Partial<PropertyFull>;
  owner?: Partial<Owner>;
  client?: Partial<Client>;
  user?: Partial<User>
  propertyJson?: Partial<PropertyReview>
  location?: string;
  amount: string;
  reason: string;
  totalDue?: string;
  pendingToCollect?: string;
  observations:  string;
  service?: string;
  serviceType?: string;
  transactionType: TransactionType;
  currency: Currency;
  wayToPay: WayToPay;
  entity: Entity;
  createdAt: Date;
  isTemporalTransaction: boolean;
  transactionId?: string;
  createdBy: string | null;
}

export interface TemporalTransaction {
  id?: string;
  date: Date,
  amount: string;
  origin: string;
  destiny: string;
  createdAt: Date;
  createdBy: string;
}

export interface CreateEditCashFlowResponse {
  message: string;
  data: CashFlowRegister
}

export interface GetAllTemporalTransaction {
  count: number;
  rows: TemporalTransaction[]
}

export interface GetAllCashFlowRegister {
  count: number;
  rows: CashFlowRegister[]
}

export interface GenericResponse {
  recordsets: Array<Recordset[]>;
  recordset: Recordset[];
  output: Output;
  rowsAffected: any[];
}

export interface GetOneCashFlowRegisterRespoonse {
  recordsets: Array<CashFlowRegister[]>;
  recordset: CashFlowRegister[];
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

export interface TemporalTransactionToCreate {
  amount: string;
  reason: string;
  entityFrom: Entity;
  entityTo: Entity;
  wayToPay: WayToPay;
  currency: Currency;
  createdBy: string;
}

export interface TemporalTransactionResponse {
  egreso: GenericResponse;
  ingreso: GenericResponse;
}

export interface CashFlowTotals {
  ingreso: CashFlowTotal;
  egreso: CashFlowTotal;
  cuentasPorCobrar: CashFlowTotal;
  cuentasPorPagar: CashFlowTotal;
  utilidad: CashFlowTotal;
  totalDisponible: CashFlowTotal
  ingresoCuentaTerceros: CashFlowTotal
}

export interface CashFlowTotalsByEntities {
  totalBnc: CashFlowTotal;
  totalBanPan: CashFlowTotal;
  totalBanVen: CashFlowTotal;
  totalBanNacTer: CashFlowTotal;
  totalOfiPaseo: CashFlowTotal;
  totalTesoreria: CashFlowTotal;
  totalOfiSanCar: CashFlowTotal;
  totalBanInTer: CashFlowTotal;
}

export interface CashFlowTotal {
  bs: number | null;
  usd: number | null;
  eur: number | null;
}

export interface CashFlowPerson {
  id: number;
  name: string;
  type: string;
}

export interface CreateEditCashFlowPeople {
  message: string;
  data: CashFlowPerson
}


export type TransactionType = "Cuenta por pagar" | "Ingreso" | "Egreso" | "Cuenta por cobrar" | "Ingreso a cuenta de terceros" ;

export type WayToPay = "Efectivo" | "Transferencia" | "Zelle" | "Pago Movil";
export type Currency = "$" | "Bs" | "€";

export type Entity =
  'Banco Nacional de Crédito (BNC)'
  | 'Banesco Panamá'
  | 'Banesco Venezuela'
  | 'Banco Nacional de Terceros'
  | 'Oficina Paseo La Granja'
  | 'Tesorería'
  | 'Oficina San Carlos'
  | 'Ingreso a Cuenta de Terceros'
