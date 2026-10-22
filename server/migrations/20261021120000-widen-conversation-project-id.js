"use strict";

/** Admin support chats store `support:investor:<uuid>` (53 chars) in projectId. */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("conversations", "projectId", {
      type: Sequelize.STRING(64),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("conversations", "projectId", {
      type: Sequelize.STRING(36),
      allowNull: false,
    });
  },
};
