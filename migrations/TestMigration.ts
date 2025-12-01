import { Migration } from '@mikro-orm/migrations';

export class TestMigration extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "post" ("id" serial primary key, "title" varchar(255) not null, "content" text not null, "author_id" int not null, "published_at" timestamptz not null);`,
    );

    this.addSql(
      `alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post" drop constraint "post_author_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "post" cascade;`);
  }
}
