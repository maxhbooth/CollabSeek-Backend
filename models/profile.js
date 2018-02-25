/* jshint indent: 2 */

var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var sequelize = require('../database/database');

var Profile = sequelize.define('profile', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    created: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    last_updated: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    position: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'position',
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeCreate: (profile) => {
            const salt = bcrypt.genSaltSync();
            profile.password = bcrypt.hashSync(profile.password, salt);
        }
    },
    tableName: 'profile'
});
Profile.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}
module.exports = Profile;
