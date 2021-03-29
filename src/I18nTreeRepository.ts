import { TreeRepository } from "typeorm";
import { I18nEntityManager } from "./I18nEntityManager";

export class I18nTreeRepository<Entity> extends TreeRepository<Entity> {
    public manager!: I18nEntityManager;

    locale(language: string): I18nTreeRepository<Entity> {
        this.manager.locale(language);
        return this;
    }
}
