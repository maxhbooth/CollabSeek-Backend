/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('profile_facility', {
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        facility_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'facility',
                key: 'id'
            }
        }
    }, {
        tableName: 'profile_facility'
    });
};
