const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");
const jalaali = require("jalaali-js");
const { json } = require("body-parser");
const employye = require("./company");
const user = require("./users");
const phone = require("./users2");


const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: false }));



//#region FIRST DATABASE

app.post('/information',async(req,res,next)=>{
    let{nationalCode,phoneNumber,lastName,password}=req.body

    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
       return res.status(200).json({message:"your phoneNumber must be 10 digits and the first not be zero"})
    }
    if(lastName.length<6){
        return res.status(200).json({message:"your lastname must be grather than 6 digits"})
    }
    if(password.length<3){
        return res.status(200).json({message:"your password must be grather than 3 digits"})
    }

 
    
    let checking = await employye.findAll()

    if(checking.length){
        for(let k=0;k<checking.length;++k){
            if(nationalCode==checking[k].nationalCode){
                return res.status(200).json({message:"your nationalCode is reapeatet"})
            }
        }
        for(let n=0;n<checking.length;++n){
            if(phoneNumber==checking[n].phoneNumber){
                return res.status(200).json({message:"your phoneNumber is reapeatet"})
            }
        }
    }
    await employye.create({
        nationalCode:nationalCode,
        phoneNumber:phoneNumber,
        lastName:lastName,
        password:password
    })
    return res.status(200).json({message:"okey database"})
    
})




app.get('/viewer/:nationalCode?',async(req,res,next)=>{
    let nationalCode=req.params.nationalCode
    let view = await employye.findAll()

    if(view.length){
        if(nationalCode){
            if(nationalCode.length!=10){
                return res.status(200).json({message:"your nationalcode must be 10 digits"}) 
            }
            for(let z=0;z<view.length;++z){
                 if(nationalCode==view[z].nationalCode){
                      return res.status(200).json({message:view[z]})
            }
        }
        return res.status(200).json({message:"not same"})
      }
      let order = await employye.findAll({
        order:[
            ["lastName" , 'DESC']
        ]
    })
      return res.status(200).json({message:order})
    }else{
        return res.status(200).json({message:'no person'})
    }
})



// app.get('/viewer/:nationalCode?',async(req,res,next)=>{
//     let nationalCode=req.params.nationalCode
//    if(nationalCode){
//     if(nationalCode.length!=10){
//         return res.status(200).json({message:"your nationalcode must be 10 digits"}) 
//     }

//     let user= await employye.findOne({where:{nationalCode:nationalCode}});
//     if(user){
//         return res.status(200).json({message:user})
//     }else{
//         return res.status(200).json({message:'no same'})
//     }

//    }
//    return res.status(200).json({message:await employye.findAll()})
// })


app.get('/delete/:input',async(req,res,next)=>{
    let input=req.params.input
    let views = await employye.findAll()

    if(views.length){
        for(let q=0;q<views.length;++q){
            if(input==views[q].nationalCode){
                await employye.destroy({where:{
                    nationalCode:input
                }})
                return res.status(200).json({message:"thanks"})
            }
            else if(input==views[q].phoneNumber){
                await employye.destroy({where:{
                    phoneNumber:input
                }})
                return res.status(200).json({message:"thanks"})
            }
        }
        return res.status(200).json({message:"not same"})
    }else{
        return res.status(200).json({message:"no person"})
    }
})


// app.get('/delete/:input',async(req,res,next)=>{
//     let input=req.params.input
//     let user = await employye.findOne({where:{
//         nationalCode:input
//     }})
//     if(user){
// await employye.destroy({where:{
//     nationalCode:input
// }})
//     }
//     return res.status(200).json({message:"no user"})
    
// })


app.post('/update',async(req,res,next)=>{
    let{nationalCode,lastName}=req.body
    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    let member = await employye.findAll()
    if(member.length){
        for(let i=0;i<member.length;++i){
            if(nationalCode==member[i].nationalCode){
                await employye.update(
                    {lastName:lastName},
                    {where:{nationalCode:nationalCode}}
                )
                return res.status(200).json({message:"okey"})
            }
        }
        return res.status(200).json({message:"not same"})

    }
    return res.status(200).json({message:"no person"})
})


//#endregion



//#region SECOND DATABASE
app.post('/registering',async(req,res,next)=>{
    let{name,lastName,age,nationalCode} = req.body
    if(name.length<3){
        return res.status(200).json({message:"your lastname must be grather than 6 digits"})
    }
    if(lastName.length<3){
        return res.status(200).json({message:"your lastname must be grather than 6 digits"})
    }
    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    

    let checks = await user.findAll()

    if(checks.length){
        for(let x=0;x<checks.length;++x){
            if(checks[x].nationalCode==nationalCode){
                return res.status(200).json({message:"your nationalCode is reapeatet"})
            }
        }
    }

    await user.create({
        name:name,
        lastName:lastName,
        age:age,
        nationalCode:nationalCode,
    })
    return res.status(200).json({message:"thanks for register"})
})





app.post('/forgenKey',async(req,res,next)=>{
    let{nationalCode,phoneNumber} = req.body

    if(nationalCode.length!=10){
        return res.status(200).json({message:"your nationalcode must be 10 digits"})
    }
    if(phoneNumber.length!=10 || phoneNumber[0]=="0"){
        return res.status(200).json({message:"your phoneNumber must be 10 digits and the first not be zero"})
    }

    let person = await user.findOne({where:{
        nationalCode:nationalCode
    }})
    if(!person){
        return res.status(200).json({message:"no person"})
    }
    
    let check = await phone.findOne({where:{
        phone:phoneNumber
    }})
    if(check){
        return res.status(200).json({message:"This phone number is already registered"})
    }

    await phone.create({
        phone:phoneNumber,userId:person.id

    })

    res.status(200).json({message:"your phoneNumber is added"})

})



app.get('/showPhoneNumber/:nationalCode',async(req,res,next)=>{
    let nationalCode = req.params.nationalCode
    let person  = await user.findOne({
        where:{
            nationalCode:nationalCode
        },
        include:[{
            model:phone,
            attributes:['phone']
           
        }],
       
})
res.status(200).json({message:person})
   
})


app.get('/showuser/:phoneNumber',async(req,res,next)=>{
    let phoneNumber = req.params.phoneNumber
    let information = await phone.findOne({
        where:{
            phone:phoneNumber
        },
        include:[{
            model:user
        }]
    })
    res.status(200).json({message:information})
})







app.listen(4001);
