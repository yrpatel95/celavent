const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

//Login Page
router.get('/login', (req, res) => res.render('login'));


//Register Page
router.get('/register', (req, res) => res.render('register'));


// Register Handle
router.post('/register', (req, res)=> {
    var {name, email, password, password2, userType, vendorServiceList} = req.body;
    let errors = [];


    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({
            msg: "Please fill in all fields"
        });
    }

    // //check required fields
    // if(userType && !photographyCB && !videographyCB && !musicCB & !foodCB){
    //     errors.push({
    //         msg: "Please select services offered"
    //     });
    // }

    //Check passwords match
    if(password != password2){
        errors.push({
            msg: "Passwords do not match"
        });
    }

    //Check passwords match
    if(password.length < 6 ){
        errors.push({
            msg: "Passwords has to be more then 6 characters"
        });
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            vendorServiceList
        });
    } else {
        //Validation passed
        User.findOne({email: email})
            .then(user => {
                if(user){
                    //user exists
                    errors.push({msg:"Email is already registered!"});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        vendorServiceList
                    });
                } else {
                    
                    if(userType!= "Host"){
                        userType = "vendor";
                    } else {
                        userType = "host";
                    }

                    const newUser = new User({
                        name,
                        email,
                        password,
                        userType,
                        vendorServiceList
                    });

                    //Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password,salt, (err, hash) =>{
                            if(err) throw err;
                            //set password to hashed password
                            newUser.password = hash;

                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered! Please login!');
                                    res.redirect('/users/login')
                                })
                                .catch( err => console.log(err));


                    }))
                }
            });

    }

});


//Login Handle
router.post('/login', (req,res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg','You have logged out!');
    res.redirect('/users/login')
});

module.exports = router;
