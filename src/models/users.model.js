const {Model, DataTypes} = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
    class UsersModel extends Model {
        static associate(models) {
            UsersModel.hasMany(models.vehicles, {
                foreignKey: 'userId',
                as: 'vehicles',
            });
            UsersModel.hasMany(models.parkings, {
                foreignKey: 'ownerId',
                as: 'parkings',
            });
            UsersModel.hasMany(models.reservations, {
                foreignKey: 'userId',
                as: 'reservations',
            });
            UsersModel.hasMany(models.payments, {
                foreignKey: 'userId',
                as: 'payments',
            });
            UsersModel.hasMany(models.notifications, {
                foreignKey: 'userId',
                as: 'notifications',
            });
            UsersModel.hasMany(models.logs, {
                foreignKey: 'actorId',
                as: 'logs',
            });
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }

    UsersModel.init({
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [11, 11]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 255]
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer', 'staff', 'owner', 'guard'),
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'users',
        hooks: {
            beforeCreate: async (users) => {
                users.password = await bcrypt.hash(users.password, 10);
            },
            beforeUpdate: async (users) => {
                if (users.changed("password")) {
                    users.password = await bcrypt.hash(users.password, 10);
                }
            }
        }
    });
    return UsersModel;
}