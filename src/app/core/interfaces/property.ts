export interface PropertyReview {
  id:                   number;
  company:              null;
  userId:               null;
  code:                 string;
  operationType:        string;
  propertyType:         PropertyType;
  propertyCondition:    string;
  footageGround:        string;
  footageBuilding:      string;
  description:          string;
  price:                string;
  property_status:      string;
  nomenclature:         string;
  adviser:              string;
  ally:                 string;
  distributionComments: string;
  observations:         string;
  externalCapacitur:    null;
  owner:                string;
  minimunNegotiation:   string;
  created_date:         Date | string;
  image:                string;
  attributes:           Attribute[];
  location:             Location;
  requestDelete:        null;
}

export interface GetPropertyPreviewResponse {
  data: PropertyReview[],
  total: number
}

export interface Attribute {
  id:            number;
  property_type: PropertyType;
  form_type:     FormType;
  label:         string;
  category:      Category;
  placeholder:   null | string;
  values:        null | string;
  value:         null;
}

export type Category = "General" | "Custom" | "Property" | "Furniture";

export type FormType = "text" | "select" | "check";

export type PropertyType = "Apartamento" | "Locales Comerciales";

export interface Location {
  country:                string;
  state:                  string;
  municipality:           string;
  urbanization:           null;
  avenue:                 string;
  street:                 string;
  buildingShoppingcenter: string;
  buildingNumber:         string;
  floor:                  string;
  referencePoint:         string;
  hotToGet:               null;
  trunkNumber:            string;
  parkingNumber:          string;
  trunkLevel:             string;
  parkingLevel:           string;
  city:                   string;
}




export interface PropertyToCreate {
  property:          Property;
  location:          Location;
  clientData:        ClientData;
  publicationSource: PublicationSource;
  images:            Image[];
  attributes:        Attribute[];
  files:             any[];
}


export interface ClientData {
  comission:         string;
  firstName:         string;
  lastName:          string;
  cellPhone:         string;
  email:             string;
  birthday:          Date;
  contactFirstName:  string;
  contactLastName:   string;
  contactCellPhone:  string;
  contactEmail:      string;
  attorneyFirstName: string;
  attorneyLastName:  string;
  attorneyCellPhone: string;
  attorneyEmail:     string;
  partOfPayment:     string;
}

export interface Image {
  id:        string;
  imageData: string;
  imageType: string;
}


export interface Property {
  property_status:      string;
  code:                 string;
  nomenclature:         string;
  footageGround:        string;
  footageBuilding:      string;
  distributionComments: string;
  description:          string;
  operationType:        string;
  propertyType:         PropertyType;
  propertyCondition:    string;
  isClosedStreet:       string;
  location:             string;
  price:                string;
  minimunNegotiation:   string;
  observations:         string;
  adviser:              number;
  externalCapacitor:    string;
  ally:                 number;
  owner:                number;
}

export interface PublicationSource {
  instagram:    boolean;
  facebook:     boolean;
  tiktok:       boolean;
  mercadolibre: boolean;
  conlallave:   boolean;
  whatsapp:     boolean;
}



export interface CreationPropertyResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface DeleteOneResponse {
  recordsets:   any[];
  output:       Output;
  rowsAffected: number[];
}

export interface Output {
}

export interface Recordset {
  ID: number;
}


