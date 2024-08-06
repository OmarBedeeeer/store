import jwt, { VerifyErrors } from "jsonwebtoken";
import { AppError } from "../../../utils/errorhandler";
import { Response, Request, NextFunction } from "express";

interface DecodedToken {
  id: string;
  email: string;
  expiresIn: number;
  role: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}
export const authentecation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined = req.header("token");

  if (!token) throw new AppError("UnAuthorized", 401);

  if (!token.startsWith("Bearer ")) throw new AppError("Invalid token", 401);

  let splitedToken: string[] = token.split("Bearer ");

  //don't have refresh token yet

  jwt.verify(
    splitedToken[1] as string,
    process.env.SECRET_KEY as string,
    (err: VerifyErrors | null, decoded) => {
      if (err) throw new AppError(err.message, 498);
      req.user = decoded;
    }
  );

  next();
};

export const authorized = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role: userRole } = req.user;
    if (role !== userRole) throw new AppError("Forbidden", 403);
    next();
  };
};
