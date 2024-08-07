type Payload = {
  id: string;
  email: string;
  role: string;
  fullName: string;
  phoneNumber: string;
  address: string;
};
declare namespace Express {
  export interface Request {
    user?: Payload;
  }
}
