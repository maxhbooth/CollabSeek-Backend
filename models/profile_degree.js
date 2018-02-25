/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('profile_degree', {
        profile_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        degree_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'degree',
                key: 'id'
            }
        },
        discipline_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'discipline',
                key: 'id'
            }
        }
    }, {
        tableName: 'profile_degree'
    });
};
