import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PetProfile } from "./PetProfile";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  avatarUrl: string;

  @Column()
  location: string;

  @Column()
  language: string;

  @OneToMany(() => PetProfile, (pet) => pet.owner, { cascade: true })
  pets: PetProfile[];
}
