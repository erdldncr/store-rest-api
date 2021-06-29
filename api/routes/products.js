const express = require("express");
const { getProducts, postProduct,getProduct,patchProduct,deleteProduct } = require("../controllers/products");
const router = express.Router();
const checkAuth=require('../middleware/check-auth')

const multer=require('multer')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function (req,file,cb) {
        cb(null,new Date().toISOString()+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    ///rejecct a file
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/png'){
        cb(null,true)
    }else{
        
        cb(null,false);
    }
 
    
}

const upload=multer({
    storage,
    limits:{fileSize:1024*1024*5},
    fileFilter
})

router.route("/")   
.get(getProducts).
post(checkAuth,upload.single('productImage'), postProduct);

router.route("/:id")
.get(getProduct).
patch(checkAuth,patchProduct).
delete(checkAuth,deleteProduct,checkAuth)


module.exports=router