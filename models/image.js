var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('image', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: Sequelize.BLOB,
        allowNull: true,
        unique: true
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
    tableName: 'image'
});
