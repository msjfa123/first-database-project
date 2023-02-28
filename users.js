const database = require('./database');
const {DataTypes} = require('sequelize');
    

let user = database.define("users",{

    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{ 
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    age:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nationalCode:{
        type:DataTypes.STRING,
        allowNull:false
    }
})



database.sync().then(() => {
    console.log('users table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports= user




