
export interface User {
  id:               number;
  company?: string;
  first_name:       string;
  last_name:        string;
  username:         string;
  phone_number1:    string;
  phone_number2?:    string;
  email:            string;
  fiscal_address:   string;
  birthday:         Date;
  profession?:       string;
  city:             string;
  state:            string;
  user_type:        string;
  social_facebook:  string;
  social_twitter:   string;
  social_instagram: string;
  social_youtube:   string;
  image?:            any;
  password:         string;
  sequence?:         number;
  exp:               number;
  allowedRoutes:    string[]
}



export interface UserToCreate {
  company:         string;
  email:           string;
  username:        string;
  password:        string;
  firstName:       string;
  lastName:        string;
  phonNumber1:     string;
  phonNumber2:     string;
  userType:        string;
  birthday:        Date;
  profession:      string;
  city:            string;
  state:           string;
  fiscalAddress:   string;
  socialFacebook:  string;
  socialInstagram: string;
  socialTwitter:   string;
  socialYoutube:   string;
  id:              null;
}
export interface CreationUserResponse {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface GetOneUserResponse {
  recordsets:   Array<User[]>;
  recordset:    User[];
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
