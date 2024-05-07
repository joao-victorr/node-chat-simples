import { Response, Request } from "express";
import { BadResquestError, UnauthorazedError } from "../../helpers/apiErrors";
import { prismaClient } from "../../databases/PrismaClient";
import bcrypt from 'bcrypt';
import { generateToken } from "../../middleware/PassportMiddleware";

type LoginData = {
  email: string;
  password: string;
}

export class LoginController {

  async login(req: Request, res: Response) {

    console.log(req.body);

    const loginData: LoginData = req.body

    if(!loginData.email || !loginData.password) {
      new BadResquestError("Data not found")
    }
    const data = await prismaClient.users.findUnique({where: {email: loginData.email}})
    
    if(!data) {
      throw new UnauthorazedError("Email or password not found")  
    }

    const varifyPassword = await bcrypt.compare(loginData.password, data.password)

    if(!varifyPassword) {
      throw new UnauthorazedError("Email or password incorrect")  
    }

    const { password: _, ...user } = data
    const token = generateToken(user.id);
    return res.status(200).json({user, token: token});

  }

}