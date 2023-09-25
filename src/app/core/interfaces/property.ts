import {Client} from "./client";
import {CashFlowRegister} from "./cashFlow";

export interface PropertyReview {
  id: number;
  publicationTitle: string;
  propertyType: string;
  operationType: string;
  price: string;
  images: string[];
  ally_id: null | number;
  owner_id: number;
  code: string;
  country: string;
  city: string;
  municipality: string;
  state: string;
  createdAt: Date;
  minimumNegotiation: string;
  user_id: number;
  externalAdviser: string;
  reasonToSellOrRent: string;
  status: string;
  files: string[];
  nomenclature: string;
  footageGround: string;
  footageBuilding: string;
}

export interface GetAllPreviews {
  rows: PropertyReview[];
  count: number;
}

export interface CreateEditPropertyResponse {
  message: string;
  data: CashFlowRegister
}


export interface PropertyFull {
  id?: number;
  user_id: number;
  ally_id: null | number;
  external_adviser_id: null | number;
  owner_id: null | number;
  files: string[];
  images: string[];
  attributes: Attribute[];
  createdAt?: Date;
  updatedAt?: Date;
  publicationTitle: string;
  documentsInformation: DocumentsInformation;
  generalInformation: GeneralInformation;
  locationInformation: LocationInformation;
  negotiationInformation: NegotiationInformation;
  client?: null | Client;
}

export interface GetPropertyPreviewResponse {
  data: PropertyReview[],
  total: number
}

export interface Attribute {
  id: number;
  propertyType: PropertyType;
  formType: FormType;
  label: string;
  category: Category;
  placeholder: null | string;
  options: null | string;
  value: null;
}

export type Category = "General" | "Custom" | "Property" | "Furniture";

export type FormType = "text" | "select" | "check";

export type PropertyType = "Apartamento" | "Locales Comerciales";

export type PropertyStatus =
  "Activo"
  | "Incompleto"
  | "Reservado"
  | "Suspendido"
  | "Cerrado por Vision doble punta"
  | "Cerrado por Vision (punta única)"
  | "Cerrado fuera de Vision"


export interface GeneralInformation {
  id: number;
  property_id: number;
  status: string;
  code: string;
  publicationTitle: string;
  nomenclature: string;
  footageGround: string;
  footageBuilding: string;
  description: string;
  operationType: string;
  propertyType: string;
  propertyCondition: string;
  instagram: boolean;
  facebook: boolean;
  tiktok: boolean;
  mercadolibre: boolean;
  whatsapp: boolean;
  conlallave: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentsInformation {
  propertyDoc: boolean;
  CIorRIF: boolean;
  ownerCIorRIF: boolean;
  spouseCIorRIF: boolean;
  isCadastralRecordSameOwner: boolean;
  condominiumSolvency: boolean;
  mortgageRelease: string;
  power: string;
  successionDeclaration: string;
  courtRulings: string;
  mainProperty: string;
  condominiumSolvencyDetails: string;
  cadastralRecordYear: string;
  realStateTaxYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationInformation {
  id: number;
  property_id: number;
  location: string;
  amountOfFloors: string;
  isClosedStreet: string;
  country: string;
  state: string;
  municipality: string;
  urbanization: string;
  avenue: string;
  street: string;
  buildingShoppingCenter: string;
  buildingNumber: string;
  floor: string;
  referencePoint: string;
  howToGet: string;
  trunkNumber: string;
  trunkLevel: string;
  parkingNumber: string;
  parkingLevel: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NegotiationInformation {
  id: number;
  property_id: number;
  price: string;
  minimumNegotiation: string;
  client: string;
  externalAdviser: string;
  reasonToSellOrRent: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactEmail: string;
  attorneyEmail: string;
  attorneyPhone: string;
  attorneyFirstName: string;
  attorneyLastName: string;
  partOfPayment: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface UpdatePropertyHistoryPayload {
  comments: string;
  property_id: string | number;
  status: PropertyStatus;
  user_id: string | number;
  username: string;
}

export interface PropertyStatusItem extends UpdatePropertyHistoryPayload {
  created_date: Date;
  id: number;
  user_Id: number;
}

export interface PropertyStatusResponse {
  rows: PropertyHistoryElement[],
  count: number;
}

export interface PropertyAutomaticCodeResponse {
  code: string;
}

export interface PropertyHistoryElement {
  id?: number;
  username: string;
  comments: string;
  status: string;
  property_id: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}


