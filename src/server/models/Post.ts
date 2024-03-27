import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./UserProfile";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @Column()
  pictureURL: string;

  @Column()
  petTags: string;

  @Column()
  visibility: string;

  @ManyToOne(() => UserProfile, (user) => user.posts, { eager: true })
  author: UserProfile;
}
