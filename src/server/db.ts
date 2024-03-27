import bcrypt from "bcrypt";
import { DataSource, type EntityManager } from "typeorm";
import { PetProfile } from "./models/PetProfile";
import { Post } from "./models/Post";
import { UserAccount } from "./models/UserAccount";
import { UserProfile } from "./models/UserProfile";
import { random } from "./utils/random";

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
  entities: [UserAccount, UserProfile, PetProfile, Post],
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
  await DB.connection.synchronize(true);

  const users: UserProfile[] = [];
  const pets: PetProfile[] = [];

  // Make between 3 and 5 users
  users.push(await seedUser("dev", "Test User", "somePassword"));
  for (let i = 0; i < random.number(2, 4); i++) {
    users.push(await seedUser(`seedUser${i}`, `Seed User ${i}`, "seed"));
  }

  // Make between 5 and 10 pets
  for (let i = 0; i < random.number(5, 10); i++) {
    pets.push(await seedPet(users));
  }

  // Make between 5 and 10 posts
  for (let i = 0; i < random.number(5, 10); i++) {
    await seedPost(`Seed Post ${i}`, users, pets);
  }
};

async function seedUser(
  username: string,
  displayName: string,
  password: string
) {
  const user = new UserAccount();
  user.username = username;
  user.passwordHash = await bcrypt.hash(password, 10);

  user.profile = new UserProfile();
  user.profile.avatarUrl = "/ugc/1.png";
  user.profile.displayName = displayName;
  user.profile.location = random.choice([
    "CSUMB",
    "California",
    "United States",
  ]);
  user.profile.language = random.choice(["en", "es", "fr"]);
  user.profile.pets = [];

  await DB.save(user);
  return user.profile;
}

async function seedPet(users: UserProfile[]) {
  const pet = new PetProfile();
  pet.avatarUrl = "/ugc/1.png";
  pet.owner = random.choice(users);
  pet.age = random.number(1, 14);
  pet.displayName = random.choice([
    "Rosco",
    "Milo",
    "Cooper",
    "Max",
    "Charlie",
    "Buddy",
    "Bear",
    "Apollo",
  ])!;
  pet.breed = random.choice(["Poodle", "Bulldog", "German Shepard"]);
  pet.color = random.choice(["White", "Brown", "Gray", "Black", "Orange"]);

  await DB.save(pet);
  return pet;
}

async function seedPost(
  caption: string,
  users: UserProfile[],
  pets: PetProfile[]
) {
  const post = new Post();
  post.author = random.choice(users);
  post.caption = caption;
  post.visibility = random.choice(["public", "friends"]);
  post.pictureURL = "TODO";

  // Tag between 1 and 3 pets
  post.petTags = Array(random.number(1, 3))
    .fill(null)
    .map(() => random.choice(pets).id)
    .join(" ");

  DB.save(post);
  return post;
}
