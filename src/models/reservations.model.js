const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Reservations extends Model {
        static associate(models) {
            Reservations.belongsTo(models.users, {
                foreignKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Reservations.belongsTo(models.vehicles, {
                foreignKey: 'vehicleId',
                as: 'vehicles',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Reservations.belongsTo(models.parkingsSlot, {
                foreignKey: 'slotId',
                as: 'parkingsSlot',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Reservations.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        }, vehicleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicles',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        }, slotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'parkingsSlot',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('reserved', 'cancelled', 'completed', 'no-show'),
            allowNull: false,
        }

    }, {
        sequelize,
        modelName: 'reservations',
    });
    return Reservations;
}