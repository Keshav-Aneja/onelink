import {
  Collection,
  CollectionInsert,
  CollectionUpdate,
  Link,
  LinkInsert,
  LinkUpdate,
  Share,
  ShareInsert,
  ShareUpdate,
  User,
  UserInsert,
  UserUpdate,
} from "@onelink/entities/models";
import { Knex } from "knex";

declare module "knex/types/tables" {
  interface Tables {
    users: Knex.CompositeTableType<
      User, //Base type for select and WHERE queries
      UserInsert, // Insert type
      UserUpdate //Update type
    >;

    collections: Knex.CompositeTableType<
      Collection,
      CollectionInsert,
      CollectionUpdate
    >;

    links: Knex.CompositeTableType<Link, LinkInsert, LinkUpdate>;

    shares: Knex.CompositeTableType<Share, ShareInsert, ShareUpdate>;
  }
}
