const orderSchema=require('../models/order')
const mongoose=require('mongoose')
const productSchema=require('../models/product')


module.exports.getOrders=async(req,res)=>{
    try {
        
        const orders= await orderSchema.find()
        .select('product quantity _id')
        .populate('product', 'name')
        return res.status(200).json({
            count:orders.length,
            orders:orders.map(order=>{
                return {
                    _id:order._id,
                    product:order.product,
                    quantity:order.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/order'+order._id
                    }
                }
            })
            
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}
module.exports.postOrder=async(req,res)=>{

    try {
        const product= await productSchema.findById(req.body.productId)
        if(product){

            const order=await new orderSchema({
                _id:mongoose.Types.ObjectId(),
                quantity:req.body.quantity,
                product:req.body.productId
            })
            await order.save()
            return res.status(201).json({
                message:'Order stored',
                createdOrder:{
                    _id:order._id,
                    quantity:order.quantity,
                    product:order.product
                },
                request:{
                    type:'GET',
                    url:'http://localhost:3000/order'+order._id
                }
            })

        }else{
            return res.status(500).json({msg:'Product could not be found '})
        }
    } catch (error) {
        return res.status(500).json({error})
    }

}

module.exports.getOrder=async(req,res)=>{
    try {
        const order= await orderSchema.findById(req.params.id).populate('product')
        if(!order){

            return res.status(404).json({msg:'Order not found'})

        }
        return res.status(200).json({
            order,
            request:{
                type:'GET',
                url:'http://localhost:3000/order'+order._id
            }

        })
    } catch (error) {
        return res.status(500).json({error})
    }
}
module.exports.deleteOrder=async(req,res)=>{
    try {
        const order= await orderSchema.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            order,
            request:{
                type:'POST',
                url:'http://localhost:3000/order',
                body:{productId:'ID',quantity:'Number'}
            }
            
        })
    } catch (error) {
        return res.status(500).json({error})
    }
}