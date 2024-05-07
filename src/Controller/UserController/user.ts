import { Request, Response } from "express";

import bcrypt from 'bcrypt';

import { ApiError } from "../../helpers/apiErrors";
import { BadResquestError } from "../../helpers/apiErrors";
import { prismaClient } from "../../databases/PrismaClient";

type CreateUserData = {
  name: string;
  email: string;
  password: string;
}

export class UserController {

  async create(req: Request, res: Response) {
    const userData: CreateUserData = req.body

    if(!userData.email || !userData.name || !userData.password) {
      new BadResquestError("Data not found")
    }

    const passwordHash = await bcrypt.hash(userData.password, 10) 

    const newUser = await prismaClient.users.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });   

    return res.status(201).json({data: newUser})
  }

}