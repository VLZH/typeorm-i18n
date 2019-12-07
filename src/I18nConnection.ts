import { I18nRepository } from "./I18nRepository";
import { Connection, EntitySchema, ObjectType, QueryRunner } from "typeorm";
import { I18nConnectionOptions } from "./connection-options";
import { I18nEntityManager } from "./I18nEntityManager";
import { I18nSelectQueryBuilder } from "./I18nQueryBuilder";

export class I18nConnection extends Connection {
    readonly manager: I18nEntityManager;

    public constructor(options: I18nConnectionOptions) {
        super(options);
        Object.assign(this, {
            ...options.oconnection // original connection
            // manager: this.createEntityManager()
        });
        this.manager = this.createEntityManager();
    }
    public createQueryBuilder<Entity>(
        ...args: any[]
    ): I18nSelectQueryBuilder<Entity> {
        const cb = super.createQueryBuilder(...args);
        return new I18nSelectQueryBuilder(cb);
    }
    public getRepository<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string
        // ...args: Parameters<EntityManager["getRepository"]>
    ): I18nRepository<Entity> {
        const repo = this.manager.getRepository(target);
        return repo;
    }
    createEntityManager(queryRunner?: QueryRunner): I18nEntityManager {
        return new I18nEntityManager(this, queryRunner);
    }
}
