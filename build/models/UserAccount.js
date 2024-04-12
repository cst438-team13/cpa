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
exports.UserAccount = void 0;
const typeorm_1 = require("typeorm");
const UserProfile_1 = require("./UserProfile");
/**
 * Used only for authentication. All profile details (name, profile photo, pets, etc) should
 * go in {@link UserProfile}.
 */
let UserAccount = class UserAccount {
    id;
    /**
     * With basic auth: username
     * With Google auth: email
     */
    username;
    /**
     * With basic auth: password hash
     * With Google auth: null
     */
    passwordHash; // Should be hashed (w/ bcrypt)
    profile;
};
exports.UserAccount = UserAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAccount.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserAccount.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: "profileId" }),
    (0, typeorm_1.OneToOne)(() => UserProfile_1.UserProfile, { cascade: true, eager: true }),
    __metadata("design:type", UserProfile_1.UserProfile)
], UserAccount.prototype, "profile", void 0);
exports.UserAccount = UserAccount = __decorate([
    (0, typeorm_1.Entity)()
], UserAccount);
