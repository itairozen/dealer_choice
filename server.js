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
    await Item.create({ name: 'item 1' });
    await Item.create({ name: 'item 2' });
    await Item.create({ name: 'item 3' });
}
const init = async()=> {
   try {
    await db.authenticate();
    await syncAndSeed();
    console.log(await Item.findAll())
   } 
   catch(ex) {
    console.log(ex);
   }
};

init()