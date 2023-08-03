import {PropertyReview} from "./property";

export interface CustomProperty extends PropertyReview {
  property_type: string;
  operation_type: string;
}

export interface CashFlowRegister {
  id:                    number;
  canon:                 null | string;
  guarantee:             null | string;
  contract:              null | string;
  tax_payer:             null | string;
  month:                 null | string;
  date:                  Date | null;
  property?:             CustomProperty;
  location:              null | string;
  client:                null | string;
  amount:                string;
  reason:                string;
  total_due:             null | string;
  pending_to_collect:    null | string;
  observations:          null | string;
  type_of_property:      null;
  service:               null | string;
  type_of_service:       null | string;
  transaction_type:      TransactionType;
  currency:              Currency;
  way_to_pay:            WayToPay;
  entity:                Entity;
  createdAt:             Date;
  isTemporalTransaction: boolean | null;
  temporalTransactionId: null | string;
  createdBy:             string | null;
}


export interface GenericResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface GetOneCashFlowRegisterRespoonse {
  recordsets:   Array<CashFlowRegister[]>;
  recordset:    CashFlowRegister[];
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

export interface TemporalTransactionToCreate {
  amount:                string;
  reason:                string;
  originEntity:          Entity;
  destinyEntity:         Entity;
  way_to_pay:            WayToPay;
  currency:              Currency;
  createdBy:             string;
  isTemporalTransaction: boolean;
}

export interface TemporalTransactionResponse {
  egreso:  GenericResponse;
  ingreso: GenericResponse;
}

export interface CashFlowTotals {
  ingreso:          CashFlowTotal;
  egreso:           CashFlowTotal;
  cuentasPorCobrar: CashFlowTotal;
  cuentasPorPagar:  CashFlowTotal;
  utilidad: CashFlowTotal;
}

export interface CashFlowTotal {
  Bs:  number | null;
  USD: number | null;
  EUR: number | null;
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
