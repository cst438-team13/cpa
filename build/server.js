"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const fs_1 = __importDefault(require("fs"));
const nullthrows_1 = __importDefault(require("nullthrows"));
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const express_2 = require("typed-rpc/express");
const typeorm_1 = require("typeorm");
const db_1 = require("./db");
const PetProfile_1 = require("./models/PetProfile");
const PetTransferRequest_1 = require("./models/PetTransferRequest");
const Post_1 = require("./models/Post");
const UserAccount_1 = require("./models/UserAccount");
const UserProfile_1 = require("./models/UserProfile");
const app = (0, express_1.default)();
const port = process.env.PORT ?? 3000;
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({ secret: "sessionKey", saveUninitialized: false, resave: false }));
app.post("/api/rpc", (0, express_2.rpcHandler)((req) => new APIService(req.session)));
app.get("/ugc/*", (req, res) => {
    fs_1.default.readFile(`/${req.url}`, (err, data) => {
        if (err) {
            res.sendStatus(404);
        }
        else {
            res.send(data);
        }
    });
});
// Make sure this is always the last app.get() call
app.get("*", (_req, res) => {
    const html = server_1.default.renderToString(react_1.default.createElement("html", { lang: "en" },
        react_1.default.createElement("head", null,
            react_1.default.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
            react_1.default.createElement("link", { href: "/css/app.css", rel: "stylesheet" }),
            react_1.default.createElement("title", null, "CPA")),
        react_1.default.createElement("body", null,
            react_1.default.createElement("div", { id: "root" }),
            react_1.default.createElement("script", { src: "/js/client.js" }))));
    res.send(html);
});
class APIService {
    session;
    constructor(session) {
        this.session = session;
    }
    async createPetProfile(userId, profileInfo) {
        const owner = await this.getUserProfile(userId);
        // New pet
        const newPet = new PetProfile_1.PetProfile();
        newPet.displayName = profileInfo.displayName;
        newPet.description = profileInfo.description;
        newPet.breed = profileInfo.breed;
        newPet.color = profileInfo.color;
        newPet.age = profileInfo.age;
        newPet.owner = owner;
        // Upload avatar
        {
            const fileId = `petavatar-${crypto.randomUUID()}`;
            const path = `/ugc/${fileId}`;
            const data = profileInfo.avatarData
                .replace("data:", "")
                .replace(/^.+,/, "");
            fs_1.default.writeFileSync(`public${path}`, data, "base64");
            newPet.avatarUrl = path;
        }
        await db_1.DB.save(newPet);
        return true;
    }
    async createPost(pictureData, text, taggedPets, visibility, userId) {
        const author = await this.getUserProfile(userId);
        // New post
        const newPost = new Post_1.Post();
        newPost.text = text;
        newPost.taggedPets = taggedPets;
        newPost.visibility = visibility;
        newPost.author = author;
        // Upload picture
        if (pictureData != null) {
            const fileId = `post-${crypto.randomUUID()}`;
            const path = `/ugc/${fileId}`;
            const data = pictureData.replace("data:", "").replace(/^.+,/, "");
            fs_1.default.writeFileSync(`public${path}`, data, "base64");
            newPost.pictureURL = path;
        }
        await db_1.DB.save(newPost);
        return true;
    }
    async removePet(petId) {
        const pet = await db_1.DB.findOneBy(PetProfile_1.PetProfile, { id: petId });
        await db_1.DB.remove(pet);
        return true;
    }
    async getPetsByUserId(userId) {
        const userProfile = await this.getUserProfile(userId);
        const pets = await db_1.DB.find(PetProfile_1.PetProfile, { where: { owner: userProfile } });
        return (0, nullthrows_1.default)(pets);
    }
    async updateUserAccount(id, password) {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.DB.findOne(UserAccount_1.UserAccount, {
            where: { id: id },
        });
        if (user) {
            user.passwordHash = passwordHash;
            await db_1.DB.save(user);
            return true;
        }
        else {
            return false;
        }
    }
    async updateUserProfile(id, updatedInfo) {
        const userProfile = await this.getUserProfile(id);
        for (const prop in updatedInfo) {
            if (updatedInfo[prop] !== undefined) {
                userProfile[prop] = updatedInfo[prop];
            }
        }
        await db_1.DB.save(userProfile);
        return true;
    }
    async updatePetProfile(id, updatedInfo) {
        const petProfile = await this.getPetProfile(id);
        for (const prop in updatedInfo) {
            if (updatedInfo[prop] !== undefined) {
                petProfile[prop] = updatedInfo[prop];
            }
        }
        await db_1.DB.save(petProfile);
        return true;
    }
    async getUserProfile(id) {
        const user = await db_1.DB.findOne(UserProfile_1.UserProfile, {
            where: { id },
        });
        return (0, nullthrows_1.default)(user);
    }
    async getAllUserProfiles() {
        const user = await db_1.DB.find(UserProfile_1.UserProfile, {
            where: {},
        });
        return (0, nullthrows_1.default)(user);
    }
    async getPetProfile(id) {
        const pet = await db_1.DB.findOne(PetProfile_1.PetProfile, {
            where: { id },
            relations: { owner: true },
        });
        return (0, nullthrows_1.default)(pet);
    }
    async getPetTransferRequests(userId) {
        return await db_1.DB.find(PetTransferRequest_1.PetTransferRequest, {
            where: {
                reciever: {
                    id: userId,
                },
            },
            relations: {
                pet: true,
            },
        });
    }
    async createPetTransferRequest(petId, recieverId) {
        const pet = await this.getPetProfile(petId);
        const reciever = await this.getUserProfile(recieverId);
        const isDuplicateRequest = await db_1.DB.exists(PetTransferRequest_1.PetTransferRequest, {
            where: {
                pet,
                reciever,
            },
        });
        if (isDuplicateRequest) {
            return false;
        }
        const request = new PetTransferRequest_1.PetTransferRequest();
        request.pet = await this.getPetProfile(petId);
        request.reciever = await this.getUserProfile(recieverId);
        await db_1.DB.save(request);
        return true;
    }
    async acceptPetTransferRequest(id) {
        const request = await db_1.DB.find(PetTransferRequest_1.PetTransferRequest, {
            where: { id },
            relations: { pet: true, reciever: true },
        });
        const pet = request[0].pet;
        pet.owner = request[0].reciever;
        await db_1.DB.save(pet);
        await db_1.DB.remove(request);
        return true;
    }
    async denyPetTransferRequest(id) {
        const request = await db_1.DB.find(PetTransferRequest_1.PetTransferRequest, {
            where: { id },
        });
        await db_1.DB.remove(request);
        return true;
    }
    async authLoginWithPassword(username, password) {
        // TODO: hash passwords for security
        const users = await db_1.DB.findBy(UserAccount_1.UserAccount, {
            username: username,
        });
        const user = users
            .filter((o) => o.passwordHash)
            .filter((o) => bcrypt_1.default.compareSync(password, o.passwordHash))
            .at(0);
        if (user) {
            this.session.userId = user.id;
            return true;
        }
        else {
            return false;
        }
    }
    // Returns the next "count" feed posts
    async getFeedPostsForUser(userId, start, count) {
        // Home page: show all posts by the user or their friends. TODO: Implement
        // Profile page: if logged in as this user, show ALL posts by them. Else, show all public posts.
        const isAuthor = await this.checkCurrentUserIs(userId);
        const isFriendOfAuthor = false;
        const user = await this.getUserProfile(userId);
        const posts = await db_1.DB.find(Post_1.Post, {
            where: {
                author: user,
                visibility: isAuthor || isFriendOfAuthor ? undefined : "public",
            },
            order: {
                creationDate: "DESC",
            },
            relations: ["taggedPets"],
        });
        return {
            posts: posts.slice(start, start + count),
            hasMore: posts.length > start + count,
        };
    }
    async getFeedPostsForPet(petId, start, count) {
        const pet = (await db_1.DB.find(PetProfile_1.PetProfile, {
            where: { id: petId },
            relations: ["taggedPosts", "taggedPosts.taggedPets"],
        }))[0];
        const posts = pet.taggedPosts;
        return {
            posts: posts.slice(start, start + count),
            hasMore: posts.length > start + count,
        };
    }
    async searchUsers(name, location) {
        return db_1.DB.find(UserProfile_1.UserProfile, {
            where: {
                location,
                displayName: (0, typeorm_1.Like)(`%${name}%`),
            },
        });
    }
    async searchPets(name, location, id) {
        return db_1.DB.find(PetProfile_1.PetProfile, {
            where: {
                id,
                displayName: (0, typeorm_1.Like)(`%${name}%`),
                owner: {
                    location,
                },
            },
        });
    }
    async authLoginWithGoogle(token) {
        const email = await axios_1.default
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.data.email);
        const user = await db_1.DB.findOneBy(UserAccount_1.UserAccount, {
            username: email,
            passwordHash: undefined,
        });
        if (!user) {
            return false;
        }
        this.session.userId = user.id;
        return true;
    }
    async authSignupWithPassword(username, password, profileInfo) {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // Check if username is taken before creating account
        const isNameInUse = await db_1.DB.exists(UserAccount_1.UserAccount, {
            where: { username: username },
        });
        if (isNameInUse) {
            return false;
        }
        // New user
        const newUser = new UserAccount_1.UserAccount();
        newUser.username = username;
        newUser.passwordHash = passwordHash;
        // New profile
        newUser.profile = new UserProfile_1.UserProfile();
        newUser.profile.username = username;
        newUser.profile.displayName = profileInfo.displayName;
        newUser.profile.location = profileInfo.location;
        newUser.profile.language = profileInfo.language;
        if (profileInfo.avatarData) {
            const fileId = `avatar-${crypto.randomUUID()}`;
            const path = `/ugc/${fileId}`;
            const data = profileInfo.avatarData
                .replace("data:", "")
                .replace(/^.+,/, "");
            fs_1.default.writeFileSync(`public${path}`, data, "base64");
            newUser.profile.avatarUrl = path;
        }
        await db_1.DB.save(newUser);
        return await this.authLoginWithPassword(username, password);
    }
    async authSignupWithGoogle(token, profileInfo) {
        const email = await axios_1.default
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.data.email);
        // New user
        const newUser = new UserAccount_1.UserAccount();
        newUser.username = email;
        // New profile
        newUser.profile = new UserProfile_1.UserProfile();
        newUser.profile.username = email;
        newUser.profile.displayName = profileInfo.displayName;
        newUser.profile.location = profileInfo.location;
        newUser.profile.language = profileInfo.language;
        if (profileInfo.avatarData) {
            const fileId = `avatar-${crypto.randomUUID()}`;
            const path = `/ugc/${fileId}`;
            const data = profileInfo.avatarData
                .replace("data:", "")
                .replace(/^.+,/, "");
            fs_1.default.writeFileSync(`public${path}`, data, "base64");
            newUser.profile.avatarUrl = path;
        }
        await db_1.DB.save(newUser);
        return await this.authLoginWithGoogle(token);
    }
    authLogout() {
        this.session.userId = null;
        return true;
    }
    async getCurrentUserProfile() {
        const currentUserId = await this.getCurrentUserAccountId();
        if (!currentUserId) {
            return null;
        }
        const currentUserAccount = await db_1.DB.findOne(UserAccount_1.UserAccount, {
            where: { id: currentUserId },
            relations: ["profile"],
        });
        return (0, nullthrows_1.default)(currentUserAccount?.profile);
    }
    async getCurrentUserAccountId() {
        return this.session.userId ?? null;
    }
    // Returns true if we are currently logged in with the given user profile id.
    async checkCurrentUserIs(userId) {
        const currentUserProfile = await this.getCurrentUserProfile();
        return currentUserProfile?.id == userId;
    }
}
console.log("Connecting to DB...");
// Connect to DB, then start up server
db_1.DB.init()
    .then(async () => {
    console.log("Connected to DB");
    const shouldSeed = process.argv.slice(2).includes("--clean");
    if (shouldSeed) {
        console.log("Seeding DB...");
        await db_1.DB.seed();
        console.log("Seeded DB");
    }
    app.listen(port, () => {
        console.log(`Now running at http://localhost:${port}`);
    });
})
    .catch((error) => console.log(error));
