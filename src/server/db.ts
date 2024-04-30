import axios from "axios";
import bcrypt from "bcrypt";
import "dotenv/config";
import { DataSource, type EntityManager } from "typeorm";
import { FriendRequest } from "./models/FriendRequest";
import { PetProfile } from "./models/PetProfile";
import { PetTransferRequest } from "./models/PetTransferRequest";
import { Post } from "./models/Post";
import { UserAccount } from "./models/UserAccount";
import { UserProfile } from "./models/UserProfile";
import { azure } from "./utils/azure";
import { random } from "./utils/random";

interface DBManager extends EntityManager {
  dataSource: DataSource;
  init: () => Promise<DataSource>;
  seed: () => Promise<void>;
}

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: "iv7yk8xt5q8bsq9e",
  entities: [
    UserAccount,
    UserProfile,
    PetProfile,
    Post,
    FriendRequest,
    PetTransferRequest,
  ],
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

  // Make 24 posts
  for (let i = 0; i < 24; i++) {
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
  const randomImage = (
    await axios.get("https://source.unsplash.com/random/?dog,profile,avatar")
  ).request.res.responseUrl;

  const pet = new PetProfile();
  pet.avatarUrl = randomImage;
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
  const isTextPost = random.choice([true, false]);

  const post = new Post();
  post.author = random.choice(users);
  post.text = isTextPost ? random.choice(PARAGRAPH_DATA) : caption;
  post.visibility = random.choice(["public", "friends"]);
  post.language = (await azure.detectLang(post.text)) ?? "en";

  if (!isTextPost) {
    const randomImage = (
      await axios.get("https://source.unsplash.com/random/?dog")
    ).request.res.responseUrl;

    post.pictureURL = randomImage;
  }

  // Tag between 1 and 3 pets (no duplicates)
  post.taggedPets = Array(random.number(1, 3))
    .fill(null)
    .map(() => random.choice(pets))
    .filter((o, i, a) => a.indexOf(o) === i);

  DB.save(post);
  return post;
}

const PARAGRAPH_DATA: string[] = [
  "For those who are interested in finding random paragraphs, that's exactly what this webpage provides. If both a random word and a random sentence aren't quite long enough for your needs, then a random paragraph might be the perfect solution. Once you arrive at this page, you'll see a random paragraph. If you need another one, all you need to do is click on the \"next paragraph\" button. If you happen to need several random paragraphs all at once, you can use this other paragraph generator. Below you can find a number of ways that this generator can be used.",
  "There are a number of reasons you may need a block of text and when you do, a random paragraph can be the perfect solution. If you happen to be a web designer and you need some random text to show in your layout, a random paragraph can be an excellent way to do this. If you're a programmer and you need random text to test the program, using these paragraphs can be the perfect way to do this. Anyone who's in search of realistic text for a project can use one or more of these random paragraphs to fill their need.",
  "Pour les écrivains qui cherchent un moyen de donner libre cours à leur créativité, l’utilisation d’un paragraphe aléatoire peut être un excellent moyen d’y parvenir. L’un des grands avantages de cet outil est que personne ne sait ce qui va apparaître dans le paragraphe. Cela peut être exploité de différentes manières pour forcer l'écrivain à faire preuve de créativité. Par exemple, le paragraphe aléatoire peut être utilisé comme paragraphe de début d'une histoire que l'écrivain doit terminer. Je peux également être utilisé comme paragraphe quelque part dans une nouvelle, ou pour un défi créatif plus difficile, il peut être utilisé comme paragraphe de fin. Dans tous les cas, l'écrivain est obligé de faire preuve de créativité pour incorporer le paragraphe aléatoire dans l'histoire.",
  "For some writers, it isn't getting the original words on paper that's the challenge, but rewriting the first and second drafts. Using the random paragraph generator can be a good way to get into a rewriting routine before beginning the project. In this case, you take the random paragraph and rewrite it so it retains the same meaning, but does so in a better and more concise way. Beginning the day doing this with a random paragraph can make the rewriting of an article, short story, or chapter of a book much easier than trying to begin directly with it.",
  "When it comes to writers' block, often the most difficult part is simply beginning to put words to paper. One way that can often help is to write about something completely different from what you're having the writers' block about. This is where a random paragraph can be quite helpful. By using this tool you can begin to chip away at the writers' block by simply adding to the random paragraph that appears with the knowledge that it's going to be completely different from any writing you've been doing. Then once you begin to put words on the paper, it should be easier to transition into the writing that needs to get done.",
  "For those who are looking for a difficult writing challenge, the random paragraph generator can provide that as well. Instead of writing about the entire paragraph, take each sentence in the paragraph and make each of those individual sentences the first or last sentence of each paragraph of a short story. Trying this difficult writing challenge should stretch your creativity to the limit.",
  "De beste manier om deze willekeurige alinea's te gebruiken, is door er een paar te genereren en te kijken hoe ze kunnen helpen bij welk project u momenteel ook nastreeft. U zou snel moeten kunnen achterhalen of deze tool nuttig zal zijn voor uw project of behoeften. Vaak is de beste manier om te zien of dit is wat u zocht, het te gebruiken en er zelf achter te komen.",
  "We're always seeking constructive ideas on how we can improve our random paragraph generator. If you have used this tool and have an idea on how we could improve it for the benefit of everyone, we'd love to hear from you. Take a moment to email us with your ideas so we can consider them for future updates.",
  "Hallward quedó estupefacto. Miró a Dorian Gray con absoluto asombro. Nunca antes lo había visto así. El muchacho estaba realmente pálido de rabia. Tenía las manos apretadas y las pupilas de sus ojos parecían discos de fuego azul. Estaba temblando por todas partes.",
  "Der Maler starrte ihn an. „Mein lieber Junge, was für ein Unsinn!“, rief er. „Willst du damit sagen, dass dir nicht gefällt, was ich von dir gemacht habe? Wo ist es? Warum hast du den Wandschirm davorgezogen? Lass es mich ansehen. Es ist das Beste, was ich je gemacht habe. Nimm den Wandschirm weg, Dorian. Es ist einfach eine Schande, dass dein Diener mein Werk so versteckt. Ich hatte das Gefühl, dass das Zimmer anders aussah, als ich hereinkam.“",
];
