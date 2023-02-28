const database = require('./database');
const {DataTypes} = require('sequelize');
const user = require('./users');

let phone = database.define("phones",{

    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
   phone:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
   },
//    userid:{
//     type:DataTypes.INTEGER,
//     allowNull:false,
//    references:{
//     key:"id",
//     model:user
//    }
//    }
})

phone.belongsTo(user)
user.hasMany(phone)
database.sync().then(() => {
    console.log('phone table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports= phone
