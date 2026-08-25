"use strict";

/**
 * Prefer programmatic seed via `src/shared/database/seed.ts` (npm start / DB_SYNC).
 * This CLI seeder delegates to the same logic when running under tsx.
 */
module.exports = {
  async up() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tsx/cjs/api").register();
    const { seedIfEmpty, seedDatabase } = require("../src/shared/database/seed");
    const { registerAssociations } = require("../src/shared/database/associations");
    const { connectDatabase } = require("../src/shared/database/sequelize");
    registerAssociations();
    await connectDatabase();
    await seedDatabase();
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("notifications", null, {});
    await queryInterface.bulkDelete("subscriptions", null, {});
    await queryInterface.bulkDelete("projects", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
