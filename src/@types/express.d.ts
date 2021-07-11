declare namespace Express {
  export interface Request {
    user: {
      id: string;
      access: number;
      delegation_id: string;
    };
  }
}
