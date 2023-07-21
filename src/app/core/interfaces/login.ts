export interface Login {
  recordsets:   Array<Recordset[]>;
  recordset:    Recordset[];
  output:       Output;
  rowsAffected: any[];
}

export interface Output {
}

export interface Recordset {
  id:               number;
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
}
