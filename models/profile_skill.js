/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('profile_skill', {
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        skill_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'skill',
                key: 'id'
            }
        }
    }, {
        tableName: 'profile_skill'
    });
};
