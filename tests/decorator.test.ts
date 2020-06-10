import { Connection, getMetadataArgsStorage } from "typeorm";
import { I18nConnection } from "../src";
import { Post } from "./entities/PostEntity";
import { createTestingConnection, getTestDbOptions } from "./utils";

describe("test decorator I18nColumn", () => {
    let connection: Connection;
    let i18n_connection: I18nConnection;

    beforeEach(() => {
        connection = createTestingConnection({
            type: "postgres",
            entities: [Post],
            ...getTestDbOptions(),
        });
        connection.connect();
    });

    afterEach((): Promise<any> | void => {
        if (i18n_connection && i18n_connection.isConnected) {
            return i18n_connection.close();
        }
    });

    it("correct fields count in MetadataArgsStorage", () => {
        expect(getMetadataArgsStorage().columns).toHaveLength(4);
    });

    it("correct propertyNames", () => {
        expect(
            getMetadataArgsStorage().columns.map(
                (column_meta) => column_meta.propertyName
            )
        ).toEqual(["id", "title", "title__fr", "title__ru"]);
    });
});
