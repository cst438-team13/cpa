import bcrypt from "bcrypt";
import { DataSource, type EntityManager } from "typeorm";
import { PetProfile } from "./models/PetProfile";
import { Posts } from "./models/Posts";
import { UserAccount } from "./models/UserAccount";
import { UserProfile } from "./models/UserProfile";

interface DBManager extends EntityManager {
  dataSource: DataSource;
  init: () => Promise<DataSource>;
  seed: () => Promise<void>;
}

const dataSource = new DataSource({
  type: "mysql",
  host: "r4wkv4apxn9btls2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  username: "usuzxuui6mwipij2",
  password: "xtt1ask6fapd7tqg",
  database: "iv7yk8xt5q8bsq9e",
  entities: [UserAccount, UserProfile, PetProfile, Posts],
  synchronize: true,
  logging: false,
  acquireTimeout: 30 * 1000,
  connectTimeout: 30 * 1000,
});

export const DB = dataSource.manager as DBManager;
DB.dataSource = dataSource;
DB.init = () => dataSource.initialize();

DB.seed = async () => {
  // Clear DB (delete all existing info)
  await dataSource.synchronize(true);

  // Add a user account to the db
  const user = new UserAccount();
  user.username = "dev";
  user.passwordHash = await bcrypt.hash("somePassword", 10);

  user.profile = new UserProfile();
  user.profile.avatarUrl = "/ugc/1.png";
  user.profile.displayName = "Test User";
  user.profile.location = "CSUMB";
  user.profile.language = "en";
  user.profile.pets = [];

  const pet = new PetProfile();
  pet.avatarUrl = "/ugc/1.png";
  pet.owner = user.profile;
  pet.age = 4;
  pet.displayName = "Rosco";
  pet.breed = "Poodle";
  pet.color = "White";

  await DB.save(user);
  await DB.save(pet);
};
