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
exports.PetTransferRequest = void 0;
const typeorm_1 = require("typeorm");
const PetProfile_1 = require("./PetProfile");
const UserProfile_1 = require("./UserProfile");
let PetTransferRequest = class PetTransferRequest {
    id;
    reciever;
    pet;
};
exports.PetTransferRequest = PetTransferRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PetTransferRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserProfile_1.UserProfile, (user) => user.petTransferRequests),
    __metadata("design:type", UserProfile_1.UserProfile)
], PetTransferRequest.prototype, "reciever", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PetProfile_1.PetProfile, (pet) => pet.transferRequests),
    __metadata("design:type", PetProfile_1.PetProfile)
], PetTransferRequest.prototype, "pet", void 0);
exports.PetTransferRequest = PetTransferRequest = __decorate([
    (0, typeorm_1.Entity)()
], PetTransferRequest);
