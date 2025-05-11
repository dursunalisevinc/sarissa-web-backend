'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // MainCategory ile ilişki
      Category.belongsTo(models.MainCategory, {
        foreignKey: 'main_category_id',
        as: 'mainCategory',
      });

      // Alt kategori ilişkisi (self-referencing)
      Category.hasMany(models.Category, {
        foreignKey: 'parent_category_id',
        as: 'subCategories', // Alt kategoriler
        onDelete: 'CASCADE', // Ana kategori silinirse, alt kategoriler de silinsin
      });

      // Alt kategoriye ait bir kategori varsa, bu kategori üst kategori olur
      Category.belongsTo(models.Category, {
        foreignKey: 'parent_category_id',
        as: 'parentCategory', // Üst kategori
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      main_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'main_categories', // Ana kategori referansı
          key: 'id',
        },
      },
      parent_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories', // Kendi kategorisine referans (self-referencing)
          key: 'id',
        },
        allowNull: true, // Alt kategori olmaması durumunda null olabilir
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
      underscored: true,
    }
  );

  return Category;
};
