import { Connection, getMetadataArgsStorage } from "typeorm";
import { I18nConnection } from "../src";
import { AuthorEntity } from "./entities/AuthorEntity";
import { PostEntity } from "./entities/PostEntity";
import { createTestingConnection, getTestDbOptions } from "./utils";

describe("test decorator I18nColumn", () => {
    let connection: Connection;
    let i18n_connection: I18nConnection;

    beforeEach(() => {
        connection = createTestingConnection({
            type: "postgres",
            entities: [PostEntity, AuthorEntity],
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
        expect(getMetadataArgsStorage().columns).toHaveLength(8);
    });

    it("correct propertyNames", () => {
        expect(
            getMetadataArgsStorage().columns.reduce((acc, column_meta) => {
                const targetName =
                    typeof column_meta.target === "string"
                        ? column_meta.target
                        : column_meta.target.name;
                if (!(targetName in acc)) {
                    acc[targetName] = [];
                }
                const c = acc[targetName] as string[];
                c.push(column_meta.propertyName);
                return acc;
            }, {} as { [key: string]: string[] })
        ).toEqual({
            PostEntity: ["id", "title", "title__fr", "title__ru"],
            AuthorEntity: ["id", "full_name", "full_name__fr", "full_name__ru"],
        });
    });
});
