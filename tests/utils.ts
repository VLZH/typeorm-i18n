import { readFile } from "fs";
import { join } from "path";
import "reflect-metadata";
import {
    Connection,
    ConnectionOptions,
    DatabaseType,
    EntitySchema,
    getConnectionManager,
    NamingStrategyInterface,
} from "typeorm";
import { promisify } from "util";
import { I18nConnection } from "../src";
import { Post } from "./entities/PostEntity";

const asyncReadFile = promisify(readFile);

async function loadFixture(entity_name: "Post") {
    const bf = await asyncReadFile(
        join(__dirname, `./fixtures/${entity_name}.fixtures.json`)
    );
    return JSON.parse(bf.toString());
}

export interface TestingOptions {
    __dirname?: string;
    name?: string;
    type: DatabaseType;
    host?: string;
    port?: number;
    username?: string;
    database?: string;
    password?: string;
    enabledDrivers?: DatabaseType[];
    entities?: (string | Function | EntitySchema<any>)[];
    migrations?: string[];
    subscribers?: string[] | Function[];
    schemaCreate?: boolean;
    dropSchema?: boolean;
    logging?: boolean;
    schema?: string;
    namingStrategy?: NamingStrategyInterface;
    cache?:
        | boolean
        | {
              type?: "database" | "redis";
              options?: any;
              alwaysEnabled?: boolean;
              duration?: number;
          };
    driverSpecific?: Object;
}

export const createTestingConnection = (
    options: TestingOptions
): Connection => {
    const connection = getConnectionManager().create(
        setupTestingConnections({
            enabledDrivers: [options.type],
            ...options,
        })
    );
    return connection;
};

export function setupTestingConnections(
    options?: TestingOptions
): ConnectionOptions {
    let newOptions: any = Object.assign({}, options as ConnectionOptions, {
        name: options && options.name ? options.name : "default",
        entities: options && options.entities ? options.entities : [],
        migrations: options && options.migrations ? options.migrations : [],
        subscribers: options && options.subscribers ? options.subscribers : [],
        dropSchema:
            options && options.dropSchema !== undefined
                ? options.dropSchema
                : false,
        cache: options ? options.cache : undefined,
    });
    return newOptions;
}

/**
 * Create fixtures in db
 * @returns {Promise<boolean>} successfully
 */
export async function createFixtures(
    connection: I18nConnection
): Promise<boolean> {
    const repo = connection.manager.getRepository(Post);
    await connection.synchronize();
    const fixtures = await loadFixture("Post");
    for (let fixture of fixtures) {
        const already_exist = await repo.count({
            where: { id: fixture.id },
        });
        if (!already_exist) {
            await repo.save(fixture);
        }
    }
    return true;
}

export const getTestDbOptions = () => ({
    host: "localhost",
    port: 5433,
    database: "test",
    username: "test",
    password: "test",
});
