const express = require("express");
const router = express.Router();
const Event = require('../models/event');
const { ensureAuthenticated } = require('../config/auth');



// Welcome Page
router.get('/', (req, res) => res.render('home'));

// Home Page
router.get('/welcome', (req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', ensureAuthenticated,(req, res) => {
    const {userType, vendorServiceList} = req.body;
    var userEmail = req.user.email;
    
    // if(userType=="vendor"){
    // //gather information for vendors
    //     Event.find({userEmail: userEmail},{},function(err,eventList){
    //         if(err){
    //             console.log("Error recieving the all the cleint event list");
    //             console.log(err);
    //         } else {
    //             //console.log(eventList);
    //             res.render('dashboard', {
    //                 name: userEmail,
    //                 clients: eventList,
    //                 userType: userType
    //             })
    //         }
    //     });

    // } else {
    //     //gather information for host
    //     Event.find({userEmail: userEmail},{},function(err,eventList){
    //         if(err){
    //             console.log("Error recieving the user list of events");
    //             console.log(err);
    //         } else {
    //             //console.log(eventList);
    //             res.render('dashboard', {
    //                 name: userEmail,
    //                 clients: eventList,
    //                 userType: userType
    //             })
    //         }
    //     });
    // }


    Event.find({userEmail: userEmail},{},function(err,eventList){
        if(err){
            console.log("Error recieving the user list of events");
            console.log(err);
        } else {
            //console.log(eventList);
            res.render('dashboard', {
                name: userEmail,
                clients: eventList,
                userType: userType
            })
        }
    });
    
    
    
});



//Create New Event Page
router.get('/newEvent', ensureAuthenticated, (req, res) => res.render('newEvent',{userEmail:req.user.email}));

//Post from New Event Page
router.post('/newEvent', ensureAuthenticated, (req, res) => {
    let errors = [];

    var {eventName, startDate, endDate, 
        endDate, venueName, venueCity,
         venueState, 
         photographyBudget, videographyBudget, entertainmentBudget} = req.body;
    const {eventLength, photographerCB,videographerCB,entertainmentCB} = req.body;
    var userEmail = req.user.email;


    

    //remove any values for budget that is selected as no
    if(photographerCB == undefined){
        photographyBudget = null;
    } else {
        if(photographyBudget == null || photographyBudget == 0){
            errors.push({
                msg: "Please fill in photography budget"
            });
        }
    }

    if(videographerCB == undefined){
        videographyBudget = null;
    } else {
        if(videographyBudget == null || videographyBudget == 0){
            errors.push({
                msg: "Please fill in videography budget"
            });
        }
    }

    if(entertainmentCB == undefined){
        entertainmentBudget = null;
    } else {
        if(entertainmentBudget == null || entertainmentBudget == 0){
            errors.push({
                msg: "Please fill in entertainment budget"
            });
        }
    }

    var newEvent = new Event({
        eventName: eventName,
        startDate: startDate,
        endDate: endDate,
        venueName: venueName,
        venueCity: venueCity,
        eventLength: eventLength,
        venueState: venueState,
        userEmail: userEmail,
        photographyBudget: photographyBudget,
        videographyBudget: videographyBudget,
        entertainmentBudget: entertainmentBudget
    });

    if(errors.length > 0){
        res.render('newEvent', {
            errors,
            eventName,
            startDate,
            endDate,
            venueName,
            venueCity,
            venueState,
            photographyBudget,
            videographyBudget,
            entertainmentBudget
        });
    } else {
        newEvent.save()
        .then(user => {
            req.flash('success_msg', 'You have added a new event!');
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err));
    }

});



module.exports = router;

