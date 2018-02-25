/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('specialty', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    }, {
        tableName: 'specialty'
    });
};
