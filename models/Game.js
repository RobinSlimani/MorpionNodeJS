const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    state: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    tableName: 'games',
    timestamps: false,
});

module.exports = Game;

