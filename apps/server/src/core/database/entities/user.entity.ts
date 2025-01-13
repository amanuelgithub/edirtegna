import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   name: string;
  @Column({ type: "varchar", length: 255 }) // Explicitly define the type
  name: string;
}
