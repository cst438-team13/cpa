import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetTransferRequest } from "./PetTransferRequest";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

@Entity()
export class PetProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  avatarUrl: string;

  @Column()
  description: string;

  @Column()
  breed: string;

  @Column()
  color: string;

  @Column()
  age: number;

  @ManyToOne(() => UserProfile, (user) => user.pets, { eager: true })
  owner: UserProfile;

  @ManyToMany(() => Post, (post) => post.taggedPets)
  taggedPosts: Post[];

  @OneToMany(() => PetTransferRequest, (req) => req.pet, { cascade: true })
  transferRequests: PetTransferRequest[];
}
