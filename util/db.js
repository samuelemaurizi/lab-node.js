const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('node-h36', 'root', 'unsureSam19$', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
