/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('profile_specialty', {
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        specialty_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'specialty',
                key: 'id'
            }
        }
    }, {
        tableName: 'profile_specialty'
    });
};
