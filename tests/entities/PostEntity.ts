import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { I18nColumn } from "../../src";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;
    @I18nColumn({
        default_language: "en",
        languages: ["en", "fr", "ru"]
    })
    @Column()
    title?: string;
}
