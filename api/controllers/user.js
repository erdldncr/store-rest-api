const userSchema= require('../models/user')
const bcrypt=require('bcrypt')
const mongoose =require('mongoose')
const jwt=require('jsonwebtoken')
module.exports.signupUser=(req,res,next)=>{
    
   userSchema.find({email:req.body.email})
   .then(user=>{

    if(user.length>=1){
        return res.status(409).json({
            message:'Mail exist'
        })
    }else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
               
                return res.status(500).json({
                    
                    error:err
                })
            }else{
                // console.log(req.body)
                const user= new userSchema({
                    _id: new mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash
            })
            console.log(user)
            user.save()
            .then(respond=>{
                return res.status(200).json({
                    message:'User created',
                    data:respond
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    message:'There is an error',
                    error:err
                })
            })
        }
    })
    }

}
) 
   
    


}
module.exports.deleteUser=(req,res,next)=>{
    userSchema
    .findByIdAndRemove(req.params.userId)
    .then(respond=>{
        return res
                    .status(200)
                    .json({
                        message:'User deleted'
                    })
    })
    .catch(err=>{
        return res.status(500).json({
            message:'User could\'nt be found',
            error:err
        })
    })
}


module.exports.userLogin=(req,res,next)=>{
    userSchema.find({email:req.body.email})
    .then(result=>{
        if(result.length<1){
            return res
            .status(401)
            .json({
                message:'Auth Failed' 
            })
        }else{
            bcrypt.compare(req.body.password,result[0].password,(err,respond)=>{
if(err){
    return res
    .status(401)
    .json({
        message:'Auth Failed' 
    })

}
if(respond){
   const token= jwt.sign({
        email:result[0].email,
        userId:result[0]._id
    },
    process.env.JWT_KEY||'secret',
    {
        expiresIn: "1hr"
    }
    )
    return res
    .status(200)
            .json({
message:'Auth Succesful',
token

            })
}
return res
.status(401)
.json({
    message:'Auth Failed' 
})


            })
           
        }
     
            })      
    .catch(err=>{
        console.log(err)
        return res
                .status(500)
                        .json({error:err})
            })          

}
module.exports.getAllUsers=async(req,res)=>{

    try {
        const users=await userSchema.find()
        return res.status(200).json({data:users})
    } catch (error) {
        return res.status(500).json({error})
    }

}
