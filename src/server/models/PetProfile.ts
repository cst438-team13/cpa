import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PetProfile {
  @PrimaryGeneratedColumn()
  petId: number;

  @Column()
  name: string;

  @Column()
  pictureURL: string;

  @Column()
  description: string;

  @Column()
  breed: string;

  @Column()
  color: string;

  @Column()
  age: number;

  @Column()
  userId: number;
}
