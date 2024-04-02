import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PetProfile } from "./PetProfile";
import { UserProfile } from "./UserProfile";

@Entity()
export class PetTransferRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, (user) => user.petTransferRequests)
  reciever: UserProfile;

  @ManyToOne(() => PetProfile, (pet) => pet.transferRequests)
  pet: PetProfile;
}
