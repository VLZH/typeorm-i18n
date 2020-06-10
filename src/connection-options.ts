import { CockroachConnectionOptions } from "typeorm/driver/cockroachdb/CockroachConnectionOptions";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { SqlServerConnectionOptions } from "typeorm/driver/sqlserver/SqlServerConnectionOptions";
import { OracleConnectionOptions } from "typeorm/driver/oracle/OracleConnectionOptions";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import { CordovaConnectionOptions } from "typeorm/driver/cordova/CordovaConnectionOptions";
import { SqljsConnectionOptions } from "typeorm/driver/sqljs/SqljsConnectionOptions";
import { ReactNativeConnectionOptions } from "typeorm/driver/react-native/ReactNativeConnectionOptions";
import { NativescriptConnectionOptions } from "typeorm/driver/nativescript/NativescriptConnectionOptions";
import { ExpoConnectionOptions } from "typeorm/driver/expo/ExpoConnectionOptions";
import { AuroraDataApiConnectionOptions } from "typeorm/driver/aurora-data-api/AuroraDataApiConnectionOptions";
import { AuroraDataApiPostgresConnectionOptions } from "typeorm/driver/aurora-data-api-pg/AuroraDataApiPostgresConnectionOptions";
import { SapConnectionOptions } from "typeorm/driver/sap/SapConnectionOptions";
import { Connection } from "typeorm";

interface I18nMysqlConnectionOptions extends MysqlConnectionOptions {
    oconnection: Connection;
}

interface I18nPostgresConnectionOptions extends PostgresConnectionOptions {
    oconnection: Connection;
}

interface I18nCockroachConnectionOptions extends CockroachConnectionOptions {
    oconnection: Connection;
}

interface I18nSqliteConnectionOptions extends SqliteConnectionOptions {
    oconnection: Connection;
}

interface I18nSqlServerConnectionOptions extends SqlServerConnectionOptions {
    oconnection: Connection;
}

interface I18nSapConnectionOptions extends SapConnectionOptions {
    oconnection: Connection;
}

interface I18nOracleConnectionOptions extends OracleConnectionOptions {
    oconnection: Connection;
}

interface I18nCordovaConnectionOptions extends CordovaConnectionOptions {
    oconnection: Connection;
}

interface I18nNativescriptConnectionOptions
    extends NativescriptConnectionOptions {
    oconnection: Connection;
}

interface I18nReactNativeConnectionOptions
    extends ReactNativeConnectionOptions {
    oconnection: Connection;
}

interface I18nSqljsConnectionOptions extends SqljsConnectionOptions {
    oconnection: Connection;
}

interface I18nMongoConnectionOptions extends MongoConnectionOptions {
    oconnection: Connection;
}

interface I18nAuroraDataApiConnectionOptions
    extends AuroraDataApiConnectionOptions {
    oconnection: Connection;
}

interface I18nAuroraDataApiPostgresConnectionOptions
    extends AuroraDataApiPostgresConnectionOptions {
    oconnection: Connection;
}

interface I18nExpoConnectionOptions extends ExpoConnectionOptions {
    oconnection: Connection;
}

export type I18nConnectionOptions =
    | I18nMysqlConnectionOptions
    | I18nPostgresConnectionOptions
    | I18nCockroachConnectionOptions
    | I18nSqliteConnectionOptions
    | I18nSqlServerConnectionOptions
    | I18nSapConnectionOptions
    | I18nOracleConnectionOptions
    | I18nCordovaConnectionOptions
    | I18nNativescriptConnectionOptions
    | I18nReactNativeConnectionOptions
    | I18nSqljsConnectionOptions
    | I18nMongoConnectionOptions
    | I18nAuroraDataApiConnectionOptions
    | I18nAuroraDataApiPostgresConnectionOptions
    | I18nExpoConnectionOptions;
