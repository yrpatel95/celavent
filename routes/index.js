const express = require("express");
const router = express.Router();
const Event = require('../models/event');
const dateFormat = require('dateformat');
const { ensureAuthenticated } = require('../config/auth');



// Welcome Page
router.get('/', (req, res) => res.render('home'));

router.get('/marketplace', (req, res) => res.render('marketplace'));

// Home Page
router.get('/welcome', (req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', ensureAuthenticated,(req, res) => {
   
    var userEmail = req.user.email;
    const userType = req.user.userType;


    if(userType=="vendor"){
        const vendorServiceList = req.user.vendorServiceList;
        console.log(vendorServiceList);

        Event.find({vendorServiceList: {$in:vendorServiceList}},{},function(err,eventList){
            if(err){
                console.log("Error recieving the user list of events");
                console.log(err);
            } else {
                // console.log(eventList);
                res.render('marketplace', {
                    eventList: eventList,
                });
            }
        });

        
    } else {
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
       
    }
    

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
    var vendorServiceList = [];

    

    //remove any values for budget that is selected as no
    if(photographerCB == undefined){
        photographyBudget = null;
    } else {
        if(photographyBudget == null || photographyBudget == 0){
            errors.push({
                msg: "Please fill in photography budget"
            });
        }
        vendorServiceList.push("Photography");

    }

    if(videographerCB == undefined){
        videographyBudget = null;
    } else {
        if(videographyBudget == null || videographyBudget == 0){
            errors.push({
                msg: "Please fill in videography budget"
            });
        }
        vendorServiceList.push("Videography");
    }

    if(entertainmentCB == undefined){
        entertainmentBudget = null;
    } else {
        if(entertainmentBudget == null || entertainmentBudget == 0){
            errors.push({
                msg: "Please fill in entertainment budget"
            });
        }
        vendorServiceList.push("Entertainment");
    }

    var newEvent = new Event({
        eventName: eventName,
        startDate: dateFormat(startDate, "mmmm dS, yyyy"),
        endDate: dateFormat(endDate, "mmmm dS, yyyy"),
        venueName: venueName,
        venueCity: venueCity,
        eventLength: eventLength,
        venueState: venueState,
        userEmail: userEmail,
        vendorServiceList: vendorServiceList,
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

