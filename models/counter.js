module.exports = (sequelize, DataTypes) => (
  sequelize.define('counter', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    totalCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    todayCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    timestamps: false,
    paranoid: false,
  })
);
