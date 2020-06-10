# typeorm-i18n 🚧

Translation tool for your typeorm models.

> This package does not ready for production, but you can help me to do this! Let`s fork!

-   [Installation](#Installation)
-   [Usage](#Usage)
    -   [Simple](#Simple)
    -   [With nestjs](#With_nestjs)
-   [CHANGELOG](#CHANGELOG)
-   [TODO](#TODO)
-   [Development](#Development)

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

## Simple

Declare entity:

```typescript
import { Entity, Column } from "typeorm";
import { I18nColumn } from "typeorm-i18n";

@Entity("articles")
export class Article extends BaseSeoEntity {
    @I18nColumn({
        default_language: "ru",
        languages: ["ru", "en", "kg"],
    })
    @Column()
    title: string;
    @I18nColumn({
        default_language: "ru",
        languages: ["ru", "en", "kg"],
    })
    @Column({
        type: "text",
    })
    body: string;
}
```

Get data:

```typescript
import { createConnection, Connection } from "typeorm";
import { getI18nConnection } from "typeorm-i18n";

const connection = await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
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

## With `nestjs`

For using this package with `nestjs` you can to use [@vlzh/nest-typeorm-i18n](https://www.npmjs.com/package/@vlzh/nest-typeorm-i18n)

# CHANGELOG

-   `0.0.7`
    -   Upgrade typeorm version to `0.2.25`.
    -   New prettier version
    -   Fix eslint configuratin for using prettier rules
    -   Add running of `fix` script in pre-commit hook
    -   Note `@vlzh/nest-typeorm-i18n` in `readme.md`

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

For the running of test you need the running postgres instance, for this just execute next command:

> Note! You should to have installed `docker engine`.

```bash
yarn [run] environment:start-db
```

after have started `postgresql` you may to run tests:

```bash
yarn test
```

When you end of testing remove container with db:

```bash
yarn [run] environment:stop-db
```
