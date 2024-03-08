import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserProfile } from "./UserProfile";

/**
 * Used only for authentication. All profile details (name, profile photo, pets, etc) should
 * go in @see UserProfile.
 */
@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * With basic auth: username
   * With Google auth: email
   */
  @Column()
  username: string;

  /**
   * With basic auth: password hash
   * With Google auth: null
   */
  @Column()
  passwordHash?: string; // Should be hashed (w/ bcrypt)

  @OneToOne(() => UserProfile, { cascade: true })
  @JoinColumn({ name: "id" })
  profile: UserProfile;
}
