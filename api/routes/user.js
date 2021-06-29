const router= require('express').Router()
const {signupUser,deleteUser,userLogin,getAllUsers} =require('../controllers/user')

router
        .route('/login')
                .post(userLogin)

router
    .route('/signup')
                    .post(signupUser)

router.
        route('/:userId')
                .delete(deleteUser)

router.
        route('/')
                .get(getAllUsers)
  
                
module.exports=router