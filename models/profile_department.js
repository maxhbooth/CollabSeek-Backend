/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('profile_department', {
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        department_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'department',
                key: 'id'
            }
        }
    }, {
        tableName: 'profile_department'
    });
};
