const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Payments extends Model {
        static associate(models) {
            Payments.belongsTo(models.users, {
                foreignKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Payments.init({
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
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('hourly', 'subscription', 'fine'),
            allowNull: false,
        },
        method: {
            type: DataTypes.ENUM('card', 'cash', 'online', 'wallet'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'payments',
    });
    return Payments;
}