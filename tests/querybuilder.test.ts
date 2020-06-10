import { Connection, QueryBuilder } from "typeorm";
import {
    getI18nConnection,
    I18nConnection,
    I18nEntityManager,
    I18nRepository,
    I18nSelectQueryBuilder,
} from "../src";
import { getLanguage, isTranslation, trimSuffx } from "../src/I18nQueryBuilder";
import { Post } from "./entities/PostEntity";
import {
    createFixtures,
    createTestingConnection,
    getTestDbOptions,
} from "./utils";

describe("test utils functions", () => {
    it("isTranslation", () => {
        expect(isTranslation("title__ru")).toBe(true);
        expect(isTranslation("title__rus")).toBe(false);
        expect(isTranslation("abc")).toBe(false);
        expect(isTranslation("__ab")).toBe(false);
    });
    it("trimSuffx", () => {
        expect(trimSuffx("title__ru")).toBe("title");
        expect(trimSuffx("title__rus")).toBe("title__rus");
        expect(trimSuffx("abc")).toBe("abc");
        expect(trimSuffx("__ru")).toBe("__ru");
    });
    it("getLanguage", () => {
        expect(getLanguage("title__ru")).toBe("ru");
        expect(getLanguage("title__rus")).toBe(null);
        expect(getLanguage("abc")).toBe(null);
        expect(getLanguage("__ru")).toBe(null);
    });
    it("getTranslations", () => {
        // TODO:
    });
});

describe("createQueryBuilder returns I18nQueryBuilder", () => {
    let connection: Connection;
    let i18n_connection: I18nConnection;

    beforeEach(async () => {
        connection = createTestingConnection({
            type: "postgres",
            name: "d1",
            entities: [Post],
        });
        i18n_connection = getI18nConnection("d1");
    });

    afterEach(() => {
        if (i18n_connection && i18n_connection.isConnected) {
            return i18n_connection.close();
        }
        return undefined;
    });

    it("I18nConnection.createQueryBuilder returns I18nQueryBuilder", () => {
        expect(i18n_connection.createQueryBuilder()).toBeInstanceOf(
            I18nSelectQueryBuilder
        );
    });

    it("original Collection`s method createQueryBuilder returns QueryBuilder", () => {
        expect(connection.createQueryBuilder()).toBeInstanceOf(QueryBuilder);
    });

    it("I18nQueryBuilder is equal original QueryBuilder in some fileds", () => {
        const ocb = connection.createQueryBuilder();
        const cb = i18n_connection.createQueryBuilder();
        expect(cb.expressionMap).not.toBe(ocb.expressionMap);
    });
});

describe("calling of I18nQueryBuilder.executeEntitiesAndRawResults", () => {
    let connection: Connection;
    let i18n_connection: I18nConnection;
    let mockedExecuteEntitiesAndRawResults: jest.Mock;

    beforeAll(async () => {
        connection = createTestingConnection({
            type: "postgres",
            name: "d2",
            entities: [Post],
            ...getTestDbOptions(),
        });
        await connection.connect();
        i18n_connection = getI18nConnection("d2");
        await createFixtures(i18n_connection);
        mockedExecuteEntitiesAndRawResults = jest
            .fn()
            .mockImplementation(
                (I18nSelectQueryBuilder.prototype as any)
                    .executeEntitiesAndRawResults
            );
        (I18nSelectQueryBuilder.prototype as any).executeEntitiesAndRawResults = mockedExecuteEntitiesAndRawResults;
    });

    afterEach(() => {
        mockedExecuteEntitiesAndRawResults.mockClear();
    });

    it("I18nQueryBuilder.executeEntitiesAndRawResults called on findOne", async () => {
        const repo: I18nRepository<Post> = i18n_connection.getRepository(Post);
        await repo.findOne();
        expect(mockedExecuteEntitiesAndRawResults.mock.calls).toHaveLength(1);
    });

    it("I18nQueryBuilder.executeEntitiesAndRawResults called on find", async () => {
        const repo: I18nRepository<Post> = i18n_connection.getRepository(Post);
        await repo.find();
        expect(mockedExecuteEntitiesAndRawResults.mock.calls).toHaveLength(1);
    });

    // TODO: the same for I18nRepository
    // TODO: the same for I18nQueryBuilder
    describe("setting correct translations to fields through 'I18nEntityManager'", () => {
        let manager: I18nEntityManager;

        beforeAll(() => {
            manager = i18n_connection.manager;
        });

        const checkDefaultLocale = async () => {
            const post = await manager.findOne(Post, 1);
            if (post) {
                expect(post.title).toEqual("First post");
            }
        };

        it("default values before setuping of first locale", async () => {
            await checkDefaultLocale();
        });

        it("setup translated values", async () => {
            const post_fr = await manager.locale("fr").findOne(Post, 1);
            const posts_ru = await manager.locale("ru").find(Post);
            if (post_fr) {
                expect(post_fr.title).toEqual("Première poste");
            }
            if (posts_ru) {
                expect(posts_ru.map((p) => p.title)).toEqual([
                    "Первый пост",
                    "Второй пост",
                    "Третий пост",
                ]);
            }
        });

        it("default values after setuping of first locale", async () => {
            await checkDefaultLocale();
        });
    });
});
