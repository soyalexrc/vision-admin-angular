import {Property, PropertyReview} from "./property";

export interface CustomProperty extends PropertyReview {
  property_type: string;
  operation_type: string;
}

export interface CashFlowRegister {
  id: number;
  canon?: string;
  guarantee?:  string;
  contract?:  string;
  taxPayer?: string;
  month: string;
  date: Date;
  property?: number;
  propertyJson?: Partial<Property>
  location?: string;
  client?: string;
  amount: string;
  reason: string;
  totalDue?: string;
  pendingToCollect?: string;
  observations:  string;
  service?: string;
  typeOfService?: string;
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
  originEntity: Entity;
  destinyEntity: Entity;
  way_to_pay: WayToPay;
  currency: Currency;
  createdBy: string;
  isTemporalTransaction: boolean;
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
}

export interface CashFlowTotal {
  bs: number | null;
  usd: number | null;
  eur: number | null;
}


export type TransactionType = "Cuenta por pagar" | "Ingreso" | "Egreso" | "Cuenta por cobrar";

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
