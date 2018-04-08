/* jshint indent: 2 */

var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var sequelize = require('../database/database');

var profile = sequelize.define('profile', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        unique: {
            msg: 'Email has already been taken.'
        },
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
    }, //add hidden_token and confirmed user//
    confirmed_user :{
        type: Sequelize.BOOLEAN,
        allowNull :false
    },
    hidden_token:{
        type: Sequelize.STRING,
        allowNull :true
    },
    password_token:{
        type: Sequelize.STRING,
        allowNull:true
    },
    imagepath: {
        type: Sequelize.STRING,
        allowNull: true
    },
    intro: {
        type: Sequelize.TEXT,
        allowNull:true
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
profile.prototype.isConfirmedUser = function(){
    return profile.confirmed_user;
};
profile.prototype.setHiddenToken= function(hidden_token){
    profile.hidden_token = hidden_token;
};
profile.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};
module.exports = profile;
