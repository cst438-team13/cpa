"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const typeorm_1 = require("typeorm");
const PetProfile_1 = require("./models/PetProfile");
const PetTransferRequest_1 = require("./models/PetTransferRequest");
const Post_1 = require("./models/Post");
const UserAccount_1 = require("./models/UserAccount");
const UserProfile_1 = require("./models/UserProfile");
const random_1 = require("./utils/random");
const dataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "r4wkv4apxn9btls2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    username: "usuzxuui6mwipij2",
    password: "xtt1ask6fapd7tqg",
    database: "iv7yk8xt5q8bsq9e",
    entities: [UserAccount_1.UserAccount, UserProfile_1.UserProfile, PetProfile_1.PetProfile, Post_1.Post, PetTransferRequest_1.PetTransferRequest],
    synchronize: true,
    logging: false,
    acquireTimeout: 30 * 1000,
    connectTimeout: 30 * 1000,
    poolSize: 8,
});
exports.DB = dataSource.manager;
exports.DB.dataSource = dataSource;
exports.DB.init = () => dataSource.initialize();
// Fills ("seeds") the DB with sample data for testing
exports.DB.seed = async () => {
    // Clear DB (delete all existing info)
    await exports.DB.connection.synchronize(true);
    const users = [];
    const pets = [];
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
async function seedUser(username, password, useDefaultInfo) {
    const user = new UserAccount_1.UserAccount();
    user.username = username;
    user.passwordHash = await bcrypt_1.default.hash(password, 10);
    user.profile = new UserProfile_1.UserProfile();
    user.profile.username = username;
    user.profile.avatarUrl = useDefaultInfo
        ? "/ugc/1.png"
        : random_1.random.internet.avatar();
    user.profile.displayName = useDefaultInfo
        ? "Test User"
        : random_1.random.names.firstName();
    user.profile.location = useDefaultInfo ? "CSUMB" : random_1.random.address.country();
    user.profile.language = random_1.random.choice(["en", "es", "fr"]);
    user.profile.pets = [];
    await exports.DB.save(user);
    return user.profile;
}
async function seedPet(users) {
    const pet = new PetProfile_1.PetProfile();
    pet.avatarUrl = "/ugc/1.png";
    pet.owner = random_1.random.choice(users);
    pet.description = random_1.random.lorem.paragraph();
    pet.age = random_1.random.number(1, 14);
    pet.displayName = random_1.random.choice([
        "Rosco",
        "Milo",
        "Cooper",
        "Max",
        "Charlie",
        "Buddy",
        "Bear",
        "Apollo",
    ]);
    pet.breed = random_1.random.choice(["Poodle", "Bulldog", "German Shepard"]);
    pet.color = random_1.random.choice(["White", "Brown", "Gray", "Black", "Orange"]);
    await exports.DB.save(pet);
    return pet;
}
async function seedPost(caption, users, pets) {
    const isTextPost = random_1.random.number(1, 3) === 1;
    const post = new Post_1.Post();
    post.author = random_1.random.choice(users);
    post.text = isTextPost ? random_1.random.lorem.paragraph() : caption;
    post.visibility = random_1.random.choice(["public", "friends"]);
    if (!isTextPost) {
        const randomImage = (await axios_1.default.get("https://source.unsplash.com/random/?dog")).request.res.responseUrl;
        post.pictureURL = randomImage;
    }
    // Tag between 1 and 3 pets (no duplicates)
    post.taggedPets = Array(random_1.random.number(1, 3))
        .fill(null)
        .map(() => random_1.random.choice(pets))
        .filter((o, i, a) => a.indexOf(o) === i);
    exports.DB.save(post);
    return post;
}
