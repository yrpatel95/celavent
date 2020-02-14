const express = require("express");
const router = express.Router();
const Event = require('../models/event');
const { ensureAuthenticated } = require('../config/auth');


var clientList = [
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" },
    { eventName: "Nidhi & Yash", image: "https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName: "Hyatt Regency Chesapeake Bay", venueCity: "Cambridge", venueState: "MD", budget: "10000", eventLenght: "Multi-Day Event", startDate: "May 28,2021", endDate: "May 30,2021" }
];

// Welcome Page
router.get('/', (req, res) => res.render('home'));

// Home Page
router.get('/welcome', (req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name,
    clients: clientList
}));



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
            req.flash('success_msg', 'You are now registered! Please login!');
            res.send("<h1>HELLO</h1>");
        })
        .catch(err => console.log(err));

});



module.exports = router;

