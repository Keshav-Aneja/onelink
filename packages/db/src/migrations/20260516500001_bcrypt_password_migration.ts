import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // All existing collection passwords are SHA256 hashes (no salt, GPU-crackable).
  // They cannot be migrated to bcrypt. Unprotect those collections so owners
  // are prompted to set new passwords via the UI.
  await knex("collections")
    .where("is_protected", true)
    .update({ is_protected: false, password: null });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback not possible — SHA256 hashes are no longer compatible with verification.
}
