const { sequelize } = require('../models');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Comments',
      [
        {
          user_id: 1,
          post_id: 1,
          text: 'Comment #1 to Post #1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          post_id: 1,
          text: 'Comment #2 to Post #1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          post_id: 2,
          text: 'Comment #1 to Post #2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          post_id: 2,
          text: 'Comment #2 to Post #2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
