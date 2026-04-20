import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1776679303035 implements MigrationInterface {
    name = 'Migrations1776679303035';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "originalFilename" character varying NOT NULL, "fileSize" double precision NOT NULL, "contentType" character varying NOT NULL, "storagePath" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid, "uploadedById" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "column_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "position" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_45a473cb99131da825f25086ffb" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "workspace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "isPrivate" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "UQ_0d706c438a9b1ae0ac9806a201a" UNIQUE ("slug"), CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."board_member_role_enum" AS ENUM('ADMIN', 'VIEWER', 'MEMBER')`,
        );
        await queryRunner.query(
            `CREATE TABLE "board_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."board_member_role_enum" NOT NULL DEFAULT 'MEMBER', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, "userId" uuid, "invitedById" uuid, CONSTRAINT "UQ_3b3f88668dcf46c95b7e4b9f98a" UNIQUE ("userId", "boardId"), CONSTRAINT "PK_c27bedbf846391cf1af5e4a74d1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."board_visibility_enum" AS ENUM('PUBLIC', 'PRIVATE', 'WORKSPACE')`,
        );
        await queryRunner.query(
            `CREATE TABLE "board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "backgroundColor" character varying, "isArchived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "archivedAt" TIMESTAMP, "visibility" "public"."board_visibility_enum" NOT NULL DEFAULT 'PRIVATE', "deletedAt" TIMESTAMP, "createdById" uuid, "workspaceId" uuid, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "isEdited" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid, "authorId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "color" character varying NOT NULL, "groupName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid, CONSTRAINT "unique_tag_per_workspace" UNIQUE ("workspaceId", "name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "task_assignee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "assignedAt" TIMESTAMP NOT NULL DEFAULT now(), "assignedById" uuid, "taskId" uuid, "userId" uuid, CONSTRAINT "PK_75114a0b55080c15694f3d40ec9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "task_watcher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "watchedAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid, "userId" uuid, CONSTRAINT "UQ_dec52062bc494eb8addae2788f9" UNIQUE ("taskId", "userId"), CONSTRAINT "PK_a1ec0e63a7b7d14084249fcf2f8" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`,
        );
        await queryRunner.query(
            `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskNumber" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium', "dueDate" TIMESTAMP, "estimatedHours" numeric, "position" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "completedAt" TIMESTAMP, "deletedAt" TIMESTAMP, "boardId" uuid, "columnId" uuid, "createdById" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."activity_activitytype_enum" AS ENUM('created', 'updated', 'assigned', 'moved', 'commented', 'attachmentAdded')`,
        );
        await queryRunner.query(
            `CREATE TABLE "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityType" "public"."activity_activitytype_enum" NOT NULL, "fieldName" character varying NOT NULL, "oldValue" json, "newValue" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid, "actorId" uuid, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."WorkspaceMemberRolesEnum" AS ENUM('owner', 'admin', 'member', 'viewer')`,
        );
        await queryRunner.query(
            `CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."WorkspaceMemberRolesEnum" NOT NULL, "message" character varying, "deadline" TIMESTAMP NOT NULL, "senderId" uuid, "invitedUserId" uuid, "workspaceId" uuid, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."UserEmailPreference_Enum" AS ENUM('immediate', 'daily_digest', 'disabled')`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "avatarUrl" character varying, "bio" character varying, "emailVerified" boolean NOT NULL DEFAULT false, "emailPreference" "public"."UserEmailPreference_Enum" NOT NULL DEFAULT 'immediate', "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP, "failedLoginAttempts" integer NOT NULL DEFAULT '0', "lockUntil" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "workspace_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."WorkspaceMemberRolesEnum" NOT NULL, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "emailPreference" "public"."UserEmailPreference_Enum", "workspaceId" uuid, "userId" uuid, "invitedById" uuid, CONSTRAINT "PK_a3a35f64bf30517010551467c6e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."NotificationTypesEnum" AS ENUM('TASK_ASSIGNED', 'USER_MENTIONED', 'TASK_DUE_SOON', 'TASK_OVERDUE', 'WORKSPACE_INVITATION', 'WATCHED_TASK_COMMENT', 'TASK_UNASSIGNED', 'TASK_CREATED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."NotificationTypesEnum" NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "linkUrl" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "readAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "task_tags" ("taskId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_20be04cfd9558da670ed177211d" PRIMARY KEY ("taskId", "tagId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_1470ad368e79cb5636163a4bf8" ON "task_tags" ("taskId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ac1cfe87c11bc138ee8675cff3" ON "task_tags" ("tagId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "attachment" ADD CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachment" ADD CONSTRAINT "FK_53bee183febd17739e30539bebe" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "column_entity" ADD CONSTRAINT "FK_5155495cc40a64f56666ccebf04" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace" ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" ADD CONSTRAINT "FK_2f41fdf7c09ac52f708260d811b" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" ADD CONSTRAINT "FK_648b9cad9a34f1a9601282751ec" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" ADD CONSTRAINT "FK_df30f378405a1e1c3b9ab80fc7d" FOREIGN KEY ("invitedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "board" ADD CONSTRAINT "FK_d958e9af935f058823a58b09cb9" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "board" ADD CONSTRAINT "FK_394199497c0242b3270d03611bf" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag" ADD CONSTRAINT "FK_8516872e5b1ff7d97b6245f6ef6" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" ADD CONSTRAINT "FK_19acf629e341a0c4d00d089823b" FOREIGN KEY ("assignedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" ADD CONSTRAINT "FK_85cfe535e3ffd256e42c9e4206a" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" ADD CONSTRAINT "FK_e37b6055ee6a974336d8ae7b0cd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_watcher" ADD CONSTRAINT "FK_58a4f16b2d25d060de350ea5b73" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_watcher" ADD CONSTRAINT "FK_9738bc7836805b483afda5e6f2f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" ADD CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" ADD CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b" FOREIGN KEY ("columnId") REFERENCES "column_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "activity" ADD CONSTRAINT "FK_2743f8990fde12f9586287eb09f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "activity" ADD CONSTRAINT "FK_52ea3a7ddc66851abf6138892bc" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_4becefb4eb12f57d8a578d83946" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_97b262171516e0f29edeeaa8f85" FOREIGN KEY ("invitedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" ADD CONSTRAINT "FK_9c6c084bcf65973479beb5cd632" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" ADD CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" ADD CONSTRAINT "FK_03ce416ae83c188274dec61205c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" ADD CONSTRAINT "FK_b9314196ac60f68218dc7942142" FOREIGN KEY ("invitedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_tags" ADD CONSTRAINT "FK_1470ad368e79cb5636163a4bf8d" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_tags" ADD CONSTRAINT "FK_ac1cfe87c11bc138ee8675cff3c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "task_tags" DROP CONSTRAINT "FK_ac1cfe87c11bc138ee8675cff3c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_tags" DROP CONSTRAINT "FK_1470ad368e79cb5636163a4bf8d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" DROP CONSTRAINT "FK_b9314196ac60f68218dc7942142"`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" DROP CONSTRAINT "FK_03ce416ae83c188274dec61205c"`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace_member" DROP CONSTRAINT "FK_15b622cbfffabc30d7dbc52fede"`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" DROP CONSTRAINT "FK_9c6c084bcf65973479beb5cd632"`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" DROP CONSTRAINT "FK_97b262171516e0f29edeeaa8f85"`,
        );
        await queryRunner.query(
            `ALTER TABLE "invitation" DROP CONSTRAINT "FK_4becefb4eb12f57d8a578d83946"`,
        );
        await queryRunner.query(
            `ALTER TABLE "activity" DROP CONSTRAINT "FK_52ea3a7ddc66851abf6138892bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "activity" DROP CONSTRAINT "FK_2743f8990fde12f9586287eb09f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" DROP CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task" DROP CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_watcher" DROP CONSTRAINT "FK_9738bc7836805b483afda5e6f2f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_watcher" DROP CONSTRAINT "FK_58a4f16b2d25d060de350ea5b73"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" DROP CONSTRAINT "FK_e37b6055ee6a974336d8ae7b0cd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" DROP CONSTRAINT "FK_85cfe535e3ffd256e42c9e4206a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_assignee" DROP CONSTRAINT "FK_19acf629e341a0c4d00d089823b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tag" DROP CONSTRAINT "FK_8516872e5b1ff7d97b6245f6ef6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`,
        );
        await queryRunner.query(
            `ALTER TABLE "board" DROP CONSTRAINT "FK_394199497c0242b3270d03611bf"`,
        );
        await queryRunner.query(
            `ALTER TABLE "board" DROP CONSTRAINT "FK_d958e9af935f058823a58b09cb9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" DROP CONSTRAINT "FK_df30f378405a1e1c3b9ab80fc7d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" DROP CONSTRAINT "FK_648b9cad9a34f1a9601282751ec"`,
        );
        await queryRunner.query(
            `ALTER TABLE "board_member" DROP CONSTRAINT "FK_2f41fdf7c09ac52f708260d811b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspace" DROP CONSTRAINT "FK_51f2194e4a415202512807d2f63"`,
        );
        await queryRunner.query(
            `ALTER TABLE "column_entity" DROP CONSTRAINT "FK_5155495cc40a64f56666ccebf04"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachment" DROP CONSTRAINT "FK_53bee183febd17739e30539bebe"`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachment" DROP CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_ac1cfe87c11bc138ee8675cff3"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_1470ad368e79cb5636163a4bf8"`,
        );
        await queryRunner.query(`DROP TABLE "task_tags"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."NotificationTypesEnum"`);
        await queryRunner.query(`DROP TABLE "workspace_member"`);
        await queryRunner.query(
            `DROP TYPE "public"."UserEmailPreference_Enum"`,
        );
        await queryRunner.query(
            `DROP TYPE "public"."WorkspaceMemberRolesEnum"`,
        );
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(
            `DROP TYPE "public"."UserEmailPreference_Enum"`,
        );
        await queryRunner.query(`DROP TABLE "invitation"`);
        await queryRunner.query(
            `DROP TYPE "public"."WorkspaceMemberRolesEnum"`,
        );
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(
            `DROP TYPE "public"."activity_activitytype_enum"`,
        );
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TABLE "task_watcher"`);
        await queryRunner.query(`DROP TABLE "task_assignee"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TYPE "public"."board_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "board_member"`);
        await queryRunner.query(`DROP TYPE "public"."board_member_role_enum"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`DROP TABLE "column_entity"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
    }
}
