export interface Client {
  id: number;
  property_id: null;
  name: string;
  contactFrom: string;
  requirementStatus: string;
  user_id: number;
  phone: string;
  operationType: string;
  propertyOfInterest: string;
  propertyLocation: string;
  typeOfCapture: string;
  specificRequirement: string;
  interestDate: null | Date;
  appointmentDate: null | Date;
  inspectionDate: null | Date;
  aspiredPrice: string;
  typeOfBusiness: null;
  note: string;
  isPotentialInvestor: boolean;
  zonesOfInterest: any[];
  essentialFeatures: any[];
  amountOfPeople: null;
  amountOfPets: null;
  amountOfYounger: null;
  arrivingDate: null | Date;
  checkoutDate: null | Date;
  amountOfNights: null;
  reasonOfStay: null;
  typeOfPerson: null;
  personEntry: null;
  personHeadquarters: null;
  personLocation: null;
  createdAt: Date;
  service: string;
  referrer: string;
  location: string;
  company: string;
  usageProperty: string;
}

export interface GetAllClients {
  rows: Client[];
  count: number;
}

export interface CreateEditClientResponse {
  data: Client,
  message: string;
}
