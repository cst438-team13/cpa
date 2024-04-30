import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfile } from "./UserProfile";

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, (user) => user.outboundFriendRequests)
  sender: UserProfile;

  @ManyToOne(() => UserProfile, (user) => user.inboundFriendRequests)
  reciever: UserProfile;
}
