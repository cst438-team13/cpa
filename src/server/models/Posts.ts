import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  caption: string;

  @Column()
  pictureURL: string;

  @Column()
  petTags: string;

  @Column()
  userTags: string;

  @Column()
  visibility: string;

  @Column()
  userId: number;
}
