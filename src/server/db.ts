import { DataSource, type EntityManager } from "typeorm";
import { User } from "./models/User";

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
  entities: [User],
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
  await dataSource.synchronize(true);

  // Add a user to the db
  const user = new User();
  user.username = "dev";
  user.password = "somePassword";
  user.name = "Developer";

  await DB.save(user);
};
