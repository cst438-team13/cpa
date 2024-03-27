import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserProfile } from "./UserProfile";

export type PostVisibility = "friends" | "public";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creationDate: Date;

  @Column()
  caption: string;

  @Column()
  pictureURL: string;

  @Column()
  petTags: string;

  @Column()
  visibility: PostVisibility;

  @ManyToOne(() => UserProfile, (user) => user.posts, { eager: true })
  author: UserProfile;
}
