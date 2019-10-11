module.exports = (sequelize, DataTypes) => (
  sequelize.define('portfolio', {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "제목",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "내용",
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "영상링크",
    },
    file: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "이미지",
    },
  }, {
    timestamps: true,
    paranoid: true,
    comment: "판매자 서비스"
  })
);

