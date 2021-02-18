const { Sequelize, DataTypes } = require('sequelize');
const faker = require('faker');
const db = new Sequelize('postgres://localhost/dealers_choice_db');

const Item = db.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT
    }
});

Item.beforeSave( item => {
    if (!item.details){
        item.details = `${item.name} Details are ${faker.lorem.paragraphs(1)}`;
    }
});

const syncAndSeed = async()=> {
    await db.sync({ force: true });
    await Item.create({ name: 'Max', details: 'Mac & Cheese, Pizza, Hot dogs, Ice Cream, Chicken Nuggets, Rice, Corn, Cucumber, Orange Juice.'});
    await Item.create({ name: 'Sadie' });
    await Item.create({ name: 'Yael' });
}

 module.exports = {
     db,
     syncAndSeed,
     models: {
         Item
     }
 };