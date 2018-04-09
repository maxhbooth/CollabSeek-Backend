/* jshint indent: 2 */

var Sequelize = require('sequelize');
var sequelize = require('../database/database')

module.exports = sequelize.define('specialty', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        parent_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        name: {
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
        tableName: 'specialty'
});

