'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      main_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'main_categories', // Ana kategori referansı
          key: 'id',
        },
        allowNull: false,
      },
      // parent_category_id: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'categories', // Kendi kategorisine referans (self-referencing)
      //     key: 'id',
      //   },
      //   allowNull: true, // Alt kategori olmaması durumunda null olabilir
      // },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  },
};
