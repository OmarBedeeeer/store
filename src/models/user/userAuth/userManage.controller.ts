import User from "../model/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError, CatchError } from "../../../utils/errorhandler";
interface UserRequestBody {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  age: number;
}
interface userChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}
interface userParams {
  id: string;
}
interface userLogin {
  userName: string;
  password: string;
}
export const userAuthController = {
  sginUp: CatchError(
    async (req: Request<{}, {}, UserRequestBody>, res: Response) => {
      const { email, password, fullName, phoneNumber, age } = req.body;
      type User = {
        fullName: string;
        email: string;
        phoneNumber: string;
        password: string;
      };

      const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

      if (user) throw new AppError("User already exists", 400);

      const hashedPassword: string = await bcrypt.hash(password, 7);

      const newUser = await User.create({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
      });

      if (!newUser) throw new AppError("Something went wrong", 400);

      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    }
  ),

  LogIn: CatchError(async (req: Request<{}, {}, userLogin>, res: Response) => {
    const { userName, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: userName }, { phoneNumber: userName }],
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token: string = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }),
  changePassword: CatchError(
    async (
      req: Request<userParams, {}, userChangePasswordBody>,
      res: Response
    ) => {
      const { oldPassword, newPassword } = req.body;

      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) throw new AppError("User not found", 400);

      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }

      if (user.id != req.user.id) throw new AppError("Unauthorized", 401);

      const isMatch: boolean = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const hashedPassword: string = await bcrypt.hash(newPassword, 7);

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({
        message: "Password changed successfully",
      });
    }
  ),
};
