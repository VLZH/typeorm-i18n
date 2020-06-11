# typeorm-i18n 🚧

Translation tool for your typeorm models.

> This package does not ready for production, but you can help me to do this! Let`s fork!

-   [Installation](#Installation)
-   [API](#API)
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

# API

### `I18nColumn`

-   `I18nColumn(options: I18nColumnOptions)`

    Decorator for mark column as translatable.

-   `I18nColumnOptions`

    Interface of configuration for `I18nColumn`.

    -   `languages` - list of languages for that column. Example: `['es', 'cn', 'en']`
    -   `default_language` - default language ???

Entity configuration example:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { I18nColumn } from "typeorm-i18n";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn() id!: number;
    @I18nColumn({
        languages: ["es", "cn", "en"],
        default_language: "en",
    })
    @Column({ length: 500 })
    name: string;

    @Column() filename!: string;
}
```

### `I18nConnection`

`I18nConnection` is wrapper around regular typeorm's connection with overwritten methods and special EntityManager(`I18nEntityManager`).

Overwritten methdos in `I18nConnection`:

-   `createQueryBuilder` - methods like original method in `typeorm.Conneciton`, but this methods returns `I18nSelectQueryBuilder<Entity>`.
-   `getRepository` - methods like original method in `typeorm.Conneciton`, but this methods returns `I18nRepository<Entity>`.

For getting `I18nConnection` you can to use this functions:

-   `getI18nConnection(connectionName?: string): I18nConnection`

    It is function for getting access to wrapper around already exist regular connection _(typeorm's `Connection`)_. This function returns `I18nConnection` instance.

-   `createI18nConnection(options?: ConnectionOptions): Promise<I18nConnection>`

    It is funciton that create regular connection and returns wrapper around regular connection.

### `I18nRepository`

It is like original `Repository` from typeorm, but this class has additional methods:

-   `locale(language: string): I18nRepository<Entity>` - configure locale for setting to fields.

    ```typescript
    const photo_repository = i18n_connection.getRepository(Photo);
    photo_repository.locale("es");
    const photo_es = photo_repository.findOne();
    console.log(photo_es.name); // 'hom'
    photo_repository.locale("ru"); // change locale
    const photo_ru = photo_repository.findOne();
    console.log(photo_ru.name); // 'дом'
    ```

### `I18nSelectQueryBuilder`

`I18nSelectQueryBuilder` it is special class that overwrite `SelectQueryBuilder` from typeorm. This class provide additional method `locale`.

# Usage exmaples

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
