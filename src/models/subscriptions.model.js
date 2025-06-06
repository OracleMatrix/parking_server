const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Subscriptions extends Model {
        static associate(models) {
            Subscriptions.belongsTo(models.parkings, {
                foreignKey: 'parkingId',
                as: 'parkings',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Subscriptions.init({
        parkingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'parkings',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        durationDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        vehicleType: {
            type: DataTypes.ENUM('car', 'motorcycle', 'truck'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'subscriptions',
    });
    return Subscriptions;
}