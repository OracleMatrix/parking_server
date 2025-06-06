const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class ParkingsModel extends Model {
        static associate(models) {
            ParkingsModel.belongsTo(models.users, {
                foreignKey: 'ownerId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            ParkingsModel.hasMany(models.parkingsSlot, {
                foreignKey: 'parkingId',
                as: 'parkingsSlot',
            });
            ParkingsModel.hasMany(models.subscriptions, {
                foreignKey: 'parkingId',
                as: 'subscriptions',
            });
        };
    }

    ParkingsModel.init({
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        totalCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hourlyRate: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'parkings',
    });
    return ParkingsModel;
}