'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MainCategory extends Model {
    static associate(models) {
      // Ana kategori birçok kategoriye sahip olabilir
      MainCategory.hasMany(models.Category, {
        foreignKey: 'main_category_id',
        as: 'categories',
        onDelete: 'CASCADE', // Ana kategori silinirse bağlı kategoriler de silinsin
      });
    }
  }

  MainCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    }
  }, {
    sequelize,
    modelName: 'MainCategory',
    tableName: 'main_categories',
    timestamps: true, // createdAt ve updatedAt aktif
    underscored: true, // created_at, updated_at gibi alan isimleri oluşturur
  });

  return MainCategory;
};
