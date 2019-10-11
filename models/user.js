module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    loginId: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      comment: "아이디",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "비밀번호",
    },
  }, {
    timestamps: false,
    paranoid: false,
    comment: "사용자"
  })
);
