import { getMetadataArgsStorage } from "typeorm";
import { I18nColumnOptions } from "./interfaces";
import { SUFFIX_DELIMITER } from "./constances";

const getPropertyNameForTranslation = (propertyName: string, lang: string) =>
    `${propertyName}${SUFFIX_DELIMITER}${lang}`;

export function I18nColumn(options: I18nColumnOptions) {
    return function (object: Object, propertyName: string) {
        // find original column in storage
        const original = getMetadataArgsStorage().columns.find(
            (column) =>
                column.target === object.constructor &&
                column.propertyName === propertyName
        );

        const additional_languages = options.languages.filter(
            (l) => l !== options.default_language
        );

        if (original) {
            for (const lang of additional_languages) {
                getMetadataArgsStorage().columns.push({
                    ...original,
                    options: {
                        ...original.options,
                        nullable: true,
                    },
                    propertyName: getPropertyNameForTranslation(
                        original.propertyName,
                        lang
                    ),
                });
            }
        } else {
            console.error(
                `Original column for ${object.constructor}:${propertyName} not found in metadata storage.`
            );
        }
    };
}
