const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class VehiclesModel extends Model {
        static associate(models) {
            VehiclesModel.belongsTo(models.users, {
                foreignKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            VehiclesModel.hasMany(models.reservations, {
                foreignKey: 'vehicleId',
                as: 'reservations',
            });
            VehiclesModel.hasMany(models.checkins, {
                foreignKey: 'vehicleId',
                as: 'checkins',
            });
        };
    }

    VehiclesModel.init({
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
        type: {
            type: DataTypes.ENUM('car', 'motorcycle', 'truck'),
            allowNull: false,
        },
        plateNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'vehicles',
    });
    return VehiclesModel;
}