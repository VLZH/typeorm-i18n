import {
    getConnection as _getConnection,
    createConnection as _createConnection,
    ConnectionOptions,
} from "typeorm";
import { I18nConnection } from "./I18nConnection";
import { I18nColumn } from "./decorators";
import { I18nEntityManager } from "./I18nEntityManager";
import { I18nSelectQueryBuilder } from "./I18nQueryBuilder";
import { I18nRepository } from "./I18nRepository";

/**
 * This function return I18nConnection from already created connection
 * @param args
 */
export const getI18nConnection = (connectionName?: string): I18nConnection => {
    const _conn = _getConnection(connectionName);
    const conn = new I18nConnection({
        ..._conn.options,
        oconnection: _conn,
    });
    return conn;
};

/**
 * This function create original Connection, then create I18nConnection(wrapper) and return it
 */
export const createI18nConnection = async (
    options?: ConnectionOptions
): Promise<I18nConnection> => {
    const _conn = options
        ? await _createConnection(options)
        : await _createConnection();
    const conn = new I18nConnection({
        ..._conn.options,
        oconnection: _conn,
    });
    return conn;
};

export {
    I18nConnection,
    I18nEntityManager,
    I18nColumn,
    I18nSelectQueryBuilder,
    I18nRepository,
};
