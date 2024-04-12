"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const fakerator_1 = __importDefault(require("fakerator"));
const fakerator = (0, fakerator_1.default)("en-us");
exports.random = {
    number(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    choice(items) {
        return items[exports.random.number(0, items.length - 1)];
    },
    ...fakerator,
};
