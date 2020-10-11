import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { I18nColumn } from "../../src";
import { PostEntity } from "./PostEntity";

@Entity()
export class AuthorEntity {
    @PrimaryGeneratedColumn()
    public id!: number;
    @I18nColumn({
        default_language: "en",
        languages: ["en", "fr", "ru"],
    })
    @Column()
    public full_name!: string;

    @OneToMany(() => PostEntity, (post) => post.author)
    posts!: PostEntity[];
}
