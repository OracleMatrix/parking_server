const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class ParkingsSlot extends Model {
        static associate(models) {
            ParkingsSlot.belongsTo(models.parkings, {
                foreignKey: 'parkingId',
                as: 'parkings',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            ParkingsSlot.hasMany(models.reservations, {
                foreignKey: 'slotId',
                as: 'reservations',
            });
            ParkingsSlot.hasMany(models.checkins, {
                foreignKey: 'slotId',
                as: 'checkins',
            });
        };
    }

    ParkingsSlot.init({
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
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('normal', 'VIP', 'disabled'),
            allowNull: false,
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'parkingsSlot',
        tableName: 'parkingsSlot',
    });
    return ParkingsSlot;
}