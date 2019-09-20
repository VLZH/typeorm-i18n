import { Repository } from "typeorm";
import { I18nEntityManager } from "./I18nEntityManager";

export class I18nRepository<Entity> extends Repository<Entity> {
    public manager!: I18nEntityManager;

    locale(language: string): I18nRepository<Entity> {
        this.manager.locale(language);
        return this;
    }
}
