const productSchema = require("../models/product");
const mongoose = require("mongoose");
const multer=require('multer')
const upload=multer({dest:'uploads/'})
module.exports.getProducts = async (req, res) => {
  // console.log(req)
  try {
    const data = await productSchema.find().select('name price _id productImage');
    return res.status(201).json({
      products:data.map(doc=>{
        return {
        name:doc.name,
        price:doc.name,
        _id:doc._id,
        productImage:doc.productImage,
          request:{
            type:'GET',
            url:'http://localhost:3000/product/'+doc._id
          }
        }
      }),
      count:data.length
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports.postProduct = (req, res) => {
 
  console.log(req.file)
  const product = new productSchema({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage:req.file.path

  });
  
  product
    .save()
    .then((respond) => {
      return res.status(200).json({
        message:'succcessful',
        id:respond._id,
        name:respond.name,
        price:respond.price,
        request:{
          type:'GET',
          url:'http://localhost:3000/product/'+respond._id
        }
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({err:'something is wrong'})
    });
 
};
module.exports.patchProduct = (req, res) => {
  const { id } = req.params;
  const upddateOps={}
  for(const ops of req.body){
      upddateOps[ops.propName]=ops.value
  }
  productSchema.update({_id:id},{$set:upddateOps}).
  exec()
  .then(result=>res.status(200).json(result))
  .catch(err=>res.status(500).json(err))

};
module.exports.getProduct = (req, res) => {
  const { id } = req.params;
  console.log('erdal')
  productSchema
    .findById(id).select('name price _id productImage')
    .exec()
    .then((respond) => {
      if (respond) {
        return res.status(201).json({
          message:'succcessful',
          name:respond.name,
          price:respond.price,
          productImage:respond.productImage,
          request:{
            type:'GET',
            url:'http://localhost:3000/product/'+respond._id
          }
        });
      } else {
        return res.status(404).json({
          msg: "Id is not valid ",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
module.exports.deleteProduct = async(req, res) => {
  const { id } = req.params;
  try {
    const respond=await productSchema.remove({_id:id})  
    return res.status(201).json(respond)
  } catch (error) {
      return res.status(500).json(error)
  }
};
