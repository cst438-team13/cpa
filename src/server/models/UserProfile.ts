import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  location: string;

  @Column()
  language: string;
}