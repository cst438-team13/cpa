"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetProfile = void 0;
const typeorm_1 = require("typeorm");
const PetTransferRequest_1 = require("./PetTransferRequest");
const Post_1 = require("./Post");
const UserProfile_1 = require("./UserProfile");
let PetProfile = class PetProfile {
    id;
    displayName;
    avatarUrl;
    description;
    breed;
    color;
    age;
    owner;
    taggedPosts;
    transferRequests;
};
exports.PetProfile = PetProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PetProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PetProfile.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PetProfile.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PetProfile.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PetProfile.prototype, "breed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PetProfile.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PetProfile.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserProfile_1.UserProfile, (user) => user.pets, {
        eager: true,
        cascade: ["update"],
    }),
    __metadata("design:type", UserProfile_1.UserProfile)
], PetProfile.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Post_1.Post, (post) => post.taggedPets),
    __metadata("design:type", Array)
], PetProfile.prototype, "taggedPosts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PetTransferRequest_1.PetTransferRequest, (req) => req.pet, { cascade: true }),
    __metadata("design:type", Array)
], PetProfile.prototype, "transferRequests", void 0);
exports.PetProfile = PetProfile = __decorate([
    (0, typeorm_1.Entity)()
], PetProfile);
