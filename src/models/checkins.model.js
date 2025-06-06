const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Checkins extends Model {
        static associate(models) {
            Checkins.belongsTo(models.vehicles, {
                foreignKey: 'vehicleId',
                as: 'vehicles',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Checkins.belongsTo(models.parkingsSlot, {
                foreignKey: 'slotId',
                as: 'parkingsSlot',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        };
    }

    Checkins.init({
        vehicleId: {
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
        entryTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        exitTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        overStayFine: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        }

    }, {
        sequelize,
        modelName: 'checkins',
    });
    return Checkins;
}