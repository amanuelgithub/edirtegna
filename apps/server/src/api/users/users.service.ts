import { UserEntity, AppDataSource } from "@server/src/core/database";

import { Request, Response } from "express";

const ds = AppDataSource;

export const usersService = {
  async create(data: Partial<UserEntity>) {
    const user = ds.getRepository(UserEntity).create(data);
    await ds.getRepository(UserEntity).save(user);
    return user;
  },

  async findAll() {
    const users = await ds.getRepository(UserEntity).find();
    console.log("users", users);
    return users;
  },

  async findOne(id: number, req: Request, res: Response) {
    const user = await ds.getRepository(UserEntity).findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).send("User not found");
    }

    return user;
  },

  async update(id: number, data: Partial<UserEntity>, req: Request, res: Response) {
    const user = await this.findOne(id, req, res);

    await ds.getRepository(UserEntity).update(id, data);
    return { ...user, ...data };
  },
};
