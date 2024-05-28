const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('morpion', 'postgres', 'morpion', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

module.exports = sequelize;

