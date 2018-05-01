var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('variables', {
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
    tableName: 'position'
});
