const express = require("express");
const router = express.Router();
const Event = require('../models/event');
const dateFormat = require('dateformat');
var ObjectId = require('mongodb').ObjectID;
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
        startDate: dateFormat(startDate, "yyyy-mm-dd"),
        endDate: dateFormat(endDate, "yyyy-mm-dd"),
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

router.get('/deleteEvent/:id', function(req, res, next) {
    var id = req.params.id;
  
    // console.log(id);

    // var userEmail = req.user.email;
    Event.deleteOne( { "_id" : ObjectId(id) },function(err,collection){
        if(err){
            console.log("Error recieving the user list of events");
            console.log(err);
        } else {
            //console.log(id + " Record(s) deleted successfully");
            res.redirect('/dashboard');
        }
    });

});

router.get('/updateEvent/:id', function(req, res, next) {
    
    var id = req.params.id;
  
    // console.log(id);

    Event.find({"_id" : ObjectId(id)},{},function(err,event){
        if(err){
            console.log("Error recieving the user list of events");
            console.log(err);
        } else {
            console.log(event[0]);
            res.render('updateEvent', {
                event: event[0],
                startDate: dateFormat(event[0].startDate, "yyyy-mm-dd"),
                endDate: dateFormat(event[0].endDate, "yyyy-mm-dd")
            })
        }
    });  

});

router.post('/updateEvent/:id', function(req, res, next) {
    
    var id = req.params.id;
    // console.log(id);

    var information = {
        eventName: req.body.eventName,
        eventLength: req.body.eventLength,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        venueName: req.body.venueName,
        venueCity: req.body.venueCity,
        venueState: req.body.venueState,
        photographerCB: req.body.photographerCB,
        photographyBudget: req.body.photographyBudget,
        videographerCB: req.body.videographerCB,
        videographyBudget: req.body.videographyBudget,
        entertainmentCB: req.body.entertainmentCB,
        entertainmentBudget: req.body.entertainmentBudget,
    };

    Event.updateOne( { "_id" : ObjectId(id) }, {$set: information} , function(err, collection){
        if(err){
            console.log("Error Updating Information");
            console.log(err);
        } else {
            res.redirect('/dashboard');
            // console.log(req.body);
            // console.log(req.user);
        }
    });
});

//View event details
router.get('/view/:id', function(req, res){
   
    var id = req.params.id;

    Event.find({"_id" : ObjectId(id)},{},function(err,event){
        if(err){
            console.log("Error recieving the event data");
            console.log(err);
        } else { 
            res.render('view', {
                event: event[0]
            })
        }
    });  

});

//Filtre for photography
router.get('/marketplace-photography', ensureAuthenticated, (req, res) =>{

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
                res.render('marketplace-photography', {
                    eventList: eventList,
                });
            }
        });
        
    }

});

//filtre for videography
router.get('/marketplace-videography', ensureAuthenticated, (req, res) =>{

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
                res.render('marketplace-videography', {
                    eventList: eventList,
                });
            }
        });
        
    }

});

//filtre for entertainment
router.get('/marketplace-entertainment', ensureAuthenticated, (req, res) =>{

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
                res.render('marketplace-entertainment', {
                    eventList: eventList,
                });
            }
        });
        
    }

});

module.exports = router;

