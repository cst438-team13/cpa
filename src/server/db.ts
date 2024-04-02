import axios from "axios";
import bcrypt from "bcrypt";
import { DataSource, type EntityManager } from "typeorm";
import { PetProfile } from "./models/PetProfile";
import { PetTransferRequest } from "./models/PetTransferRequest";
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
  entities: [UserAccount, UserProfile, PetProfile, Post, PetTransferRequest],
  synchronize: true,
  logging: false,
  acquireTimeout: 30 * 1000,
  connectTimeout: 30 * 1000,
  poolSize: 8,
});

export const DB = dataSource.manager as DBManager;
DB.dataSource = dataSource;
DB.init = () => dataSource.initialize();

// Fills ("seeds") the DB with sample data for testing
DB.seed = async () => {
  // Clear DB (delete all existing info)
  await DB.connection.synchronize(true);

  const users: UserProfile[] = [];
  const pets: PetProfile[] = [];

  // Make 3 users
  users.push(await seedUser("dev", "somePassword", true));
  for (let i = 0; i < 3; i++) {
    users.push(await seedUser(`seedUser${i}`, "seed"));
  }

  // Make 8 pets
  for (let i = 0; i < 8; i++) {
    pets.push(await seedPet(users));
  }

  // Make 18 posts
  for (let i = 0; i < 18; i++) {
    await seedPost(`Seed Post ${i}`, users, pets);
  }
};

async function seedUser(
  username: string,
  password: string,
  useDefaultInfo?: boolean
) {
  const user = new UserAccount();
  user.username = username;
  user.passwordHash = await bcrypt.hash(password, 10);

  user.profile = new UserProfile();
  user.profile.username = username;
  user.profile.avatarUrl = useDefaultInfo
    ? "/ugc/1.png"
    : random.internet.avatar();
  user.profile.displayName = useDefaultInfo
    ? "Test User"
    : random.names.firstName();
  user.profile.location = useDefaultInfo ? "CSUMB" : random.address.country();
  user.profile.language = random.choice(["en", "es", "fr"]);
  user.profile.pets = [];

  await DB.save(user);
  return user.profile;
}

async function seedPet(users: UserProfile[]) {
  const pet = new PetProfile();
  pet.avatarUrl = "/ugc/1.png";
  pet.owner = random.choice(users);
  pet.description = random.lorem.paragraph();
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
  const randomImage = (
    await axios.get("https://source.unsplash.com/random/?dog")
  ).request.res.responseUrl;

  const post = new Post();
  post.author = random.choice(users);
  post.caption = caption;
  post.visibility = random.choice(["public", "friends"]);
  post.pictureURL = randomImage;

  // Tag between 1 and 3 pets (no duplicates)
  post.taggedPets = Array(random.number(1, 3))
    .fill(null)
    .map(() => random.choice(pets))
    .filter((o, i, a) => a.indexOf(o) === i);

  DB.save(post);
  return post;
}
