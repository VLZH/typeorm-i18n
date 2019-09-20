import { QueryRunner, SelectQueryBuilder } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { Alias } from "typeorm/query-builder/Alias";
import { SUFFIX_DELIMITER } from "./constances";

const translation_regexp = new RegExp(
    `(?<=.+)${SUFFIX_DELIMITER}(\\w{2})$`,
    "gi"
);

export const isTranslation = (propertyName: string): boolean => {
    translation_regexp.lastIndex = 0;
    const match = translation_regexp.exec(propertyName);
    return !!match;
};

/**
 * Return language string from propertyName
 * @param propertyName
 */
export const getLanguage = (propertyName: string): string | null => {
    translation_regexp.lastIndex = 0;
    const match = translation_regexp.exec(propertyName);
    if (match) {
        return match[1];
    }
    return match;
};

/**
 * Return original propertyName
 * @param propertyName
 */
export const trimSuffx = (propertyName: string): string => {
    return propertyName.replace(translation_regexp, "");
};

/**
 * Define variant is translation for target
 * @param target
 * @param variant
 */
const isTranslationFor = (
    target: ColumnMetadata,
    variant: ColumnMetadata
): boolean => {
    if (isTranslation(variant.propertyName)) {
        return target.propertyName === trimSuffx(variant.propertyName);
    }
    return false;
};

const getTranslations = (
    column: ColumnMetadata,
    columns: ColumnMetadata[],
    raw: any,
    alias: Alias
) => {
    const result: {
        [key: string]: string;
    } = {};
    for (const variant of columns) {
        if (isTranslationFor(column, variant)) {
            const lang = getLanguage(variant.propertyName);
            if (lang) {
                result[lang] = raw[`${alias.name}_${variant.propertyPath}`];
            }
        }
    }
    return result;
};

export class I18nSelectQueryBuilder<T> extends SelectQueryBuilder<T> {
    private _locale: string | null = null;
    protected async executeEntitiesAndRawResults(
        queryRunner: QueryRunner
    ): Promise<{ entities: T[]; raw: any[] }> {
        const main_alias = this.expressionMap.mainAlias;
        const entity_metadata = main_alias ? main_alias.metadata : null;
        const { entities, raw } = await super.executeEntitiesAndRawResults(
            queryRunner
        );
        if (this._locale && entity_metadata && main_alias) {
            entities.forEach((entity, idx) => {
                for (const column of entity_metadata.columns) {
                    const translations = getTranslations(
                        column,
                        entity_metadata.columns,
                        raw[idx],
                        main_alias
                    );
                    if (this._locale && translations[this._locale]) {
                        (entity as any)[column.propertyPath] =
                            translations[this._locale];
                    }
                }
            });
        }
        return { entities, raw };
    }
    public locale(language: string) {
        this._locale = language;
    }
}
