import { I18nSelectQueryBuilder } from "./I18nQueryBuilder";
import {
    EntityManager,
    EntitySchema,
    ObjectType,
    TreeRepository,
    RepositoryNotTreeError,
    TreeRepositoryNotSupportedError,
} from "typeorm";
import { I18nRepository } from "./I18nRepository";
import { I18nTreeRepository } from "./I18nTreeRepository";

export class I18nEntityManager extends EntityManager {
    private _locale: string | null = null;
    public locale(language: string): I18nEntityManager {
        this._locale = language;
        return this;
    }

    public getRepository<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string
    ): I18nRepository<Entity> {
        const _repo = super.getRepository(target);
        const repo =
            _repo instanceof TreeRepository
                ? (new I18nTreeRepository() as I18nTreeRepository<Entity>)
                : (new I18nRepository() as I18nRepository<Entity>);
        Object.assign(repo, {
            manager: _repo.manager,
            metadata: _repo.metadata,
            queryRunner: _repo.queryRunner,
        });
        return repo;
    }

    getTreeRepository<Entity>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string
    ): I18nTreeRepository<Entity> {
        // tree tables aren't supported by some drivers (mongodb)
        if (this.connection.driver.treeSupport === false)
            throw new TreeRepositoryNotSupportedError(this.connection.driver);

        // check if repository is real tree repository
        const repository = this.getRepository(target);
        if (!(repository instanceof I18nTreeRepository))
            throw new RepositoryNotTreeError(target);

        return repository;
    }

    public createQueryBuilder<Entity>(
        ...args: Parameters<EntityManager["createQueryBuilder"]> | any
    ): I18nSelectQueryBuilder<Entity> {
        const qb = super.createQueryBuilder(...args) as I18nSelectQueryBuilder<
            Entity
        >;
        if (this._locale) {
            qb.locale(this._locale);
        }
        this._locale = null;
        return qb;
    }
}
