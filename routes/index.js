const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');


var clientList = [
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"},
         {eventName:"Nidhi & Yash", image:"https://images.unsplash.com/photo-1541089404510-5c9a779841fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60", venueName:"Hyatt Regency Chesapeake Bay", venueCity:"Cambridge", venueState:"MD",budget:"10000", eventLenght:"Multi-Day Event", startDate:"May 28,2021", endDate:"May 30,2021"}
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

// Home Page
router.get('/newEvent', (req, res) => res.render('newEvent'));



module.exports = router;

