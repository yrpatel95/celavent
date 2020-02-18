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
    Event.find({},{},function(err,eventList){
        if(err){
            console.log("Error recieving the client list");
            console.log(err);
        } else {
             console.log(eventList);
            res.render('dashboard', {
                name: req.user.name,
                clients: eventList
            })
        }
    });
    
    
});



//Create New Event Page
router.get('/newEvent', (req, res) => res.render('newEvent'));

//Post from New Event Page
router.post('/newEvent', (req, res) => {

    var eventName = req.body.eventName;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var venueName = req.body.venueName;
    var venueCity = req.body.venueCity;
    var venueState = req.body.venueState;
    var budget = req.body.budget;
    var eventLength = req.body.eventLength;


    var newEvent = new Event({
        eventName: eventName,
        startDate: startDate,
        endDate: endDate,
        venueName: venueName,
        venueCity: venueCity,
        eventLength: eventLength,
        venueState: venueState,
        budget: budget
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

