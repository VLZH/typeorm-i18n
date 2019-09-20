# typeorm-i18n 🚧

Translation tool for your typeorm models.

> This package does not ready for production, but you can help me to do this! Let`s fork!

# Installation

with yarn:

```bash
yarn add typeorm-i18n
```

with npm:

```bash
npm install typeorm-i18n
```

# Usage

```typescript
import { createConnection, Connection } from "typeorm";
import { getI18nConnection } from "typeorm-i18n";

const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test"
});
const i18n_connection = getI18nConnection();
/* ... */
async function someFunction(): Promise<Post> {
    const repo = i18n_connection.getRepository(Post);
    const post = await repo.locale("fr").findOne();
    return post;
}
/* ... */
```

# TODO

-   fix registration of another meta information about fields in `metadataArgsStorage`
-   write tests for `getTranslations` method and fix creating of a path in raw data(use methods from the transformer)
-   decide how to design creating-api
-   readme/doc📄
-   make more tests!☑️
-   check example👆 and write more examples (by using glitch.com)
-   (maybe🤔) exclude redundant fields from `Entity` and create api for access to translations
-   (maybe🤔) how to keep locale in a repository? (through creating of clones?)
-   ... a lot of another todos

# Development

For the running of test you need postgres for this just run:

```bash
yarn [run] environment:start-db
```
