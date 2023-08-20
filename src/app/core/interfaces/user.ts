export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  mainPhone: string;
  secondaryPhone?: string;
  email: string;
  birthDate: Date;
  userType: string;
  password: string;

  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  tiktok: string;
  city: string;
  state: string;
  profession: string;
  image?: string;
  userLevel: string;
  userCommission: string | number;
  isActive: boolean;
  address: string;

  allowedRoutes?: string[]
}

export interface GetAllUsers {
  count: number;
  rows: User[]
}

export interface CreateEditUserResponse {
  data: User,
  message: string;
}


export interface UserToCreate {
  company: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phonNumber1: string;
  phonNumber2: string;
  userType: string;
  birthday: Date;
  profession: string;
  city: string;
  state: string;
  fiscalAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  id: null;
}

export interface CreationUserResponse {
  recordsets: Array<Recordset[]>;
  recordset: Recordset[];
  output: Output;
  rowsAffected: any[];
}

export interface GetOneUserResponse {
  recordsets: Array<User[]>;
  recordset: User[];
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
