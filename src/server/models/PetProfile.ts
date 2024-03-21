import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => UserProfile, (user) => user.pets)
  owner: UserProfile;
}
