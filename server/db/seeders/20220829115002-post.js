const { sequelize } = require('../models');

let list = [];
for (let i = 1; i < 25; i += 1) {
  list.push({
    user_id: 1,
    text: 'Post',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
for (let i = 1; i < 25; i += 1) {
  list.push({
    user_id: 2,
    text: 'Post',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Posts',
      list,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
