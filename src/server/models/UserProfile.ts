import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PetProfile } from "./PetProfile";
import { PetTransferRequest } from "./PetTransferRequest";
import { Post } from "./Post";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];

  @OneToMany(() => PetTransferRequest, (req) => req.reciever, { cascade: true })
  petTransferRequests: PetTransferRequest[];
}
