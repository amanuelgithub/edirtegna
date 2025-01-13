import { DataSource } from "typeorm";
import { UserEntity } from "./entities";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "P@ss1234",
  database: "edirtegna",
  synchronize: true,
  logging: true,
  entities: [UserEntity],
  //   subscribers: [],
  //   migrations: [],
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
