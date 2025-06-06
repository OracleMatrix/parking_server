const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Logs extends Model {
        static associate(models) {
            Logs.belongsTo(models.users, {
                foreignKey: 'actorId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Logs.init({
        actorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'logs',
    });
    return Logs;
}