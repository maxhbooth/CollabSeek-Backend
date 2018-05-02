var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('variables', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
    },
    value: {
        type: Sequelize.STRING,
        allowNull: true
    },
    created: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    last_updated: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'variables'
});
