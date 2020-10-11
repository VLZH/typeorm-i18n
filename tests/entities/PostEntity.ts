import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { I18nColumn } from "../../src";
import { AuthorEntity } from "./AuthorEntity";

@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    public id!: number;
    @I18nColumn({
        default_language: "en",
        languages: ["en", "fr", "ru"],
    })
    @Column()
    public title?: string;

    @ManyToOne(() => AuthorEntity, {
        nullable: true,
    })
    author?: AuthorEntity;
}
