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
    var {eventName, startDate, endDate, 
        endDate, venueName, venueCity,
         venueState, 
         photographyBudget, videographyBudget, entertainmentBudget} = req.body;
    const {eventLength, photographerCB,videographerCB,entertainmentCB} = req.body;
    var userEmail = req.user.email;

    if(photographerCB == undefined){
        photographyBudget = null;
    }

    if(videographerCB == undefined){
        videographyBudget = null;
    }

    if(entertainmentCB == undefined){
        entertainmentBudget = null;
    }


    // var eventName = req.body.eventName;
    // var startDate = req.body.startDate;
    // var endDate = req.body.endDate;
    // var venueName = req.body.venueName;
    // var venueCity = req.body.venueCity;
    // var venueState = req.body.venueState;
    // var eventLength = req.body.eventLength;
    // var userEmail = req.user.email;
    // var photographyBudget = req.body.photographyBudget;
    // var videographyBudget = req.body.videographyBudget;
    // var entertainmentBudget = req.body.entertainmentBudget;

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


    console.log(newEvent);

    newEvent.save()
        .then(user => {
            req.flash('success_msg', 'You have added a new event!');
            res.redirect('/dashboard')
        })
        .catch(err => console.log(err));

       

});



module.exports = router;

