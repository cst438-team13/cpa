import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FriendRequest } from "./FriendRequest";
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

  @ManyToMany(() => UserProfile, (friend) => friend.friends)
  @JoinTable()
  friends: UserProfile[];

  @OneToMany(() => PetProfile, (pet) => pet.owner, { cascade: true })
  pets: PetProfile[];

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];

  @OneToMany(() => PetTransferRequest, (req) => req.reciever, { cascade: true })
  petTransferRequests: PetTransferRequest[];

  @OneToMany(() => FriendRequest, (req) => req.reciever, { cascade: true })
  inboundFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (req) => req.sender, { cascade: true })
  outboundFriendRequests: FriendRequest[];
}
