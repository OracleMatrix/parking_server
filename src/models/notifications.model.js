const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Notifications extends Model {
        static associate(models) {
            Notifications.belongsTo(models.users, {
                foreignKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Notifications.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'notifications',
    });
    return Notifications;
}