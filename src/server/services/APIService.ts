import { DB } from "../db";
import { User } from "../models/User";

export class APIService {
  constructor(private session) {}

  async authLogin(username: string, password: string) {
    // TODO: hash passwords for security
    const user = await DB.findOne(User, {
      where: { username, password },
    });

    if (user) {
      this.session.userId = user.id;
      return true;
    } else {
      return false;
    }
  }

  async authLogout() {
    this.session.userId = null;
    return true;
  }

  async registerUser(username: string, password: string, name: string) {
    // TODO: hash passwords for security
    const encryptedPassword = password;

    // checks if username is taken before creating account
    const isNameInUse = await DB.exists(User, {
      where: { username: username },
    });

    if (!isNameInUse) {
      // New user
      const newUser = new User();
      newUser.username = username;
      newUser.password = encryptedPassword;
      newUser.name = name;
      await DB.save(newUser);

      return true;
    } else {
      // username already in use
      return false;
    }
  }

  async updateUser(id: number, password: string, name: string) {
    // TODO: hash passwords for security
    const encryptedPassword = password;

    const user = await DB.findOne(User, {
      where: { id: id },
    });

    if (user) {
      user.name = name;
      user.password = encryptedPassword;
      await DB.save(user);

      return true;
    } else {
      return false;
    }
  }

  getSessionInfo() {
    const sessionInfo = {
      userId: this.session.userId as number | null,
    };

    return sessionInfo;
  }

  async getUser(id: number) {
    const user = await DB.findOne(User, {
      where: { id },
    });

    return user;
  }
}
