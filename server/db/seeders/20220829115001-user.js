const bcrypt = require('bcrypt');

const { sequelize } = require('../models');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'pc.android11257@gmail.com',
          name: 'Абдулла',
          password: await bcrypt.hash('test', 2),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'hello@keep-calm.ru',
          name: 'HR',
          password: await bcrypt.hash('test', 2),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
