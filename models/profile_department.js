/* jshint indent: 2 */
var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('profile_department', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        profile_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        department_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'department',
                key: 'id'
            },
        created: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        last_updated: {
            type: Sequelize.DATEONLY,
            allowNull: true
        }
        }
    }, {
        tableName: 'profile_department'
    });
