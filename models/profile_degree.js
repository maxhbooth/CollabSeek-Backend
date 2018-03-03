/* jshint indent: 2 */

var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('profile_degree', {
        profile_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        degree_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'degree',
                key: 'id'
            }
        },
        discipline_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'discipline',
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
        tableName: 'profile_degree'
    });
