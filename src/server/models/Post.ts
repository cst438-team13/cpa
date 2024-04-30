import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetProfile } from "./PetProfile";
import { UserProfile } from "./UserProfile";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  language: string;

  @Column()
  text: string;

  @Column()
  pictureURL: string;

  @Column()
  visibility: "friends" | "public";

  @ManyToOne(() => UserProfile, (user) => user.posts, { eager: true })
  author: UserProfile;

  @ManyToMany(() => PetProfile, (pet) => pet.taggedPosts)
  @JoinTable()
  taggedPets: PetProfile[];
}
