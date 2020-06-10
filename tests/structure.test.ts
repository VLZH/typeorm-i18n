import {
    Connection,
    getConnectionManager,
    getMetadataArgsStorage,
} from "typeorm";
import {
    getI18nConnection,
    I18nConnection,
    I18nEntityManager,
    I18nRepository,
} from "../src";
import { Post } from "./entities/PostEntity";
import { createTestingConnection, getTestDbOptions } from "./utils";

describe("structure on connection and entity manager", () => {
    let connection: Connection;
    let i18n_connection: I18nConnection;

    beforeEach(async () => {
        connection = createTestingConnection({
            type: "postgres",
            name: "default",
            ...getTestDbOptions(),
            entities: [Post],
        });
        await connection.connect();
        i18n_connection = getI18nConnection();
    });

    afterEach((): Promise<any> | void => {
        if (connection && connection.isConnected) return connection.close();
    });

    it("getMetadataArgsStorage.tables is not empty", () => {
        expect(getMetadataArgsStorage().tables).toHaveLength(1);
    });
    it("getMetadata", () => {
        expect(i18n_connection.getMetadata(Post));
    });

    it("connection is I18nConnection", () => {
        expect(i18n_connection).toBeInstanceOf(I18nConnection);
    });
    it("connection.manager is I18nEntityManager", () => {
        expect(i18n_connection.manager).toBeInstanceOf(I18nEntityManager);
    });
    it("manager.connection is I18nConnnection", () => {
        expect(i18n_connection.manager.connection).toBeInstanceOf(
            I18nConnection
        );
    });
    it("connection options/parameters is equal to original connection", () => {
        expect(connection.driver).toEqual(i18n_connection.driver);
        expect(connection.isConnected).toEqual(i18n_connection.isConnected);
        expect(connection.manager).not.toBe(i18n_connection.manager);
        expect(connection.options).toEqual(i18n_connection.options); // TODO: is correct?
        expect(connection.logger).toEqual(i18n_connection.logger);
        expect(connection.subscribers).toEqual(i18n_connection.subscribers);
        expect(connection.name).toEqual(i18n_connection.name);
        expect(connection.namingStrategy).toEqual(
            i18n_connection.namingStrategy
        );
        expect(connection.migrations).toEqual(i18n_connection.migrations);
        expect(connection.queryResultCache).toEqual(
            i18n_connection.queryResultCache
        );
    });
    it("connection.getRepository returns I18nRepository", () => {
        expect(i18n_connection.getRepository(Post)).toBeInstanceOf(
            I18nRepository
        );
    });
    it("entity_manager.getRepository returns I18nRepository", () => {
        expect(i18n_connection.manager.getRepository(Post)).toBeInstanceOf(
            I18nRepository
        );
    });
    it("connections count is 1", () => {
        expect(getConnectionManager().connections).toHaveLength(1);
    });
});
