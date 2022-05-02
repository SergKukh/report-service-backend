const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING }
});

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: 'USER' },
    title: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: 'Користувач' }
});

const Project = sequelize.define('project', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
});

const Participant = sequelize.define('participant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY },
    title: { type: DataTypes.STRING, allowNull: false },
    hours: { type: DataTypes.FLOAT },
    reported: { type: DataTypes.BOOLEAN }
});

User.hasMany(Participant);
Participant.belongsTo(User);

Role.hasMany(Participant);
Participant.belongsTo(Role);

User.hasMany(Task);
Task.belongsTo(User);

Project.hasMany(Participant);
Participant.belongsTo(Project);

Project.hasMany(Task);
Task.belongsTo(Project);

module.exports = {
    User,
    Role,
    Project,
    Participant,
    Task
}