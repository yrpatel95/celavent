const express = require("express");
const router = express.Router();
const Event = require('../models/event');
const User = require('../models/User');
const dateFormat = require('dateformat');
var { addDate } =  require('../config/date');
var ObjectId = require('mongodb').ObjectID;
const { ensureAuthenticated } = require('../config/auth');
const { render } = require("ejs");

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
        
            if(req.query.search){

                const regex = new RegExp(escape(req.query.search), 'gi');
                Event.find({$and: [{"eventName": regex}, {vendorServiceList: {$in:vendorServiceList}}]}, function(err, eventList){
                    if(err){
                        console.log(err);
                    } else {
                        if(eventList.length < 1) {
                            // req.flash('no_results', 'Event not found');
                            console.log("No Event Found");
                            res.redirect('/dashboard');
                        }else{
                            res.render('marketplace',
                            {eventList: eventList,
                            });
                        }
                    }
                });
            }else{
                Event.find({vendorServiceList: {$in:vendorServiceList}},{},function(err,eventList){
                    if(err){
                        console.log("Error recieving the user list of events");
                        console.log(err);
                    } else {
                        res.render('marketplace', 
                        {eventList: eventList,
                        }); 
                    }
                });
            }
 
        // Event.find({vendorServiceList: {$in:vendorServiceList}},{},function(err,eventList){

        //     if(err){
        //         console.log("Error recieving the user list of events");
        //         console.log(err);
        //     } else {
                // console.log(eventList);
                // res.render('marketplace', {
                //     eventList: eventList,
                // });
        //     }
        
        // });

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
         venueState, guestCount, eventSpaceLocation,extraDetailForm, 
         photographyBudget, videographyBudget, entertainmentBudget} = req.body;
    const {eventLength, photographerCB,videographerCB,entertainmentCB} = req.body;
    var userEmail = req.user.email;
    var totalBudget = 0;

    var startDateDisplay = dateFormat(addDate(startDate),"mmmm dS yyyy");

    //console.log(dateFormat(addDate(startDate), "mmmm dS yyyy"))
    
    if(eventLength == 'multiDay'){
        var endDateDisplay = dateFormat(addDate(endDate),"mmmm dS yyyy");
    } else {
        endDate = null;
        var endDateDisplay = null;

    }

    
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

    if(photographyBudget != null){
        totalBudget += parseInt(photographyBudget);
    }

    if(videographyBudget != null){
        totalBudget += parseInt(videographyBudget);
    }

    if(entertainmentBudget != null){
        totalBudget += parseInt(entertainmentBudget);
    }

    var newEvent = new Event({
        eventName: eventName,
        startDate: startDate,
        endDate: endDate,
        startDateDisplay: startDateDisplay,
        endDateDisplay: endDateDisplay,
        venueName: venueName,
        venueCity: venueCity,
        eventLength: eventLength,
        venueState: venueState,
        userEmail: userEmail,
        vendorServiceList: vendorServiceList,
        photographyBudget: photographyBudget,
        videographyBudget: videographyBudget,
        totalBudget: totalBudget,
        entertainmentBudget: entertainmentBudget,
        guestCount: guestCount,
        eventSpaceLocation: eventSpaceLocation,
        extraDetailForm: extraDetailForm,
        vendorBidList: {}

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
            entertainmentBudget,
            totalBudget,
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

router.get('/deleteEvent/:id', function(req, res) {
    var id = req.params.id;
  

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

router.get('/editProfile', ensureAuthenticated, function(req, res){

    var userEmail = req.user.email;
    var userName = req.user.name;
    var userType = req.user.userType; 
    var vendorServiceList = req.user.vendorServiceList;

    res.render("editProfile", {
        email: userEmail,
        name: userName,
        userType: userType,
        vendorServiceList: vendorServiceList
    });

});

router.post('/editProfile', ensureAuthenticated, function(req, res){

    User.findById(req.user.id, function (err, user){

        if(!user){
            errors.push({msg:"User not found!"});
            return res.redirect('/editProfile')
        }

        var userEmail = req.body.email;
        var userName = req.body.name;
        var userType = req.body.userType; 
        var vendorServiceList = req.body.vendorServiceList;

        if(!userName || !userEmail){
            //|| !password || !password2
            errors.push({
                msg: "Please fill in all fields"
            });
        }

        if(userType!= "Host"){
            userType = "vendor";
        } else {
            userType = "host";
        }

        user.email = userEmail;
        user.name = userName;
        user.userType = userType;
        user.vendorServiceList = vendorServiceList;

        user.save(function(err){
            if(err){
                console.log("Error Updating Information");
                console.log(err);
            }else{
                res.redirect('/dashboard')
            }
        });
    });                

});

router.get('/updateEvent/:id', function(req, res) {
    
    var id = req.params.id;
  

    Event.find({"_id" : ObjectId(id)},{},function(err,event){


        
        if(err){
            console.log("Error recieving the user list of events");
            console.log(err);
        } else {
            /*
            *
            * temporary fix for fixing date using the addDate. Right now when doing the date format it changes the date back 1 days
            * and to fix it created a addDate function in the /config/date file which just adds 1 day to fix the correction made by the
            * dateformat function
            * 
            */
            res.render('updateEvent', {
                event: event[0],
                startDate: dateFormat(addDate(event[0].startDate), "yyyy-mm-dd"),
                endDate: dateFormat(addDate(event[0].endDate), "yyyy-mm-dd")
            })
        }
    });  

});


router.post('/updateEvent/:id', function(req, res) {
    
    var id = req.params.id;
    // console.log(id);

    var {eventName, startDate, endDate, eventLength,
        endDate, venueName, venueCity,
         venueState, guestCount, eventSpaceLocation,extraDetailForm, 
         photographyBudget, videographyBudget, entertainmentBudget} = req.body;
    const {photographerCB,videographerCB,entertainmentCB} = req.body;
    var userEmail = req.user.email;
    var totalBudget = 0;

    startDate = addDate(startDate);
    var startDateDisplay = dateFormat(startDate,"mmmm dS yyyy");
    
    if(eventLength == 'multiDay'){
        endDate = addDate(endDate);
        var endDateDisplay = dateFormat(endDate,"mmmm dS yyyy");
    } else {
        endDate = null;
        var endDateDisplay = null;
    }

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
    
    if(photographyBudget != null){
        totalBudget += parseInt(photographyBudget);
    }

    if(videographyBudget != null){
        totalBudget += parseInt(videographyBudget);
    }

    if(entertainmentBudget != null){
        totalBudget += parseInt(entertainmentBudget);
    }

    var information = {
        eventName: eventName,
        startDate: startDate,
        endDate: endDate,
        startDateDisplay: startDateDisplay,
        endDateDisplay: endDateDisplay,
        venueName: venueName,
        venueCity: venueCity,
        eventLength: eventLength,
        venueState: venueState,
        userEmail: userEmail,
        vendorServiceList: vendorServiceList,
        photographyBudget: photographyBudget,
        videographyBudget: videographyBudget,
        entertainmentBudget: entertainmentBudget,
        totalBudget: totalBudget,
        guestCount: guestCount,
        eventSpaceLocation: eventSpaceLocation,
        extraDetailForm: extraDetailForm
    };

    Event.updateOne( { "_id" : ObjectId(id) }, {$set: information} , function(err, collection){
        if(err){
            console.log("Error Updating Information");
            console.log(err);
        } else {
            res.redirect('/dashboard');
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


//View for bids from the vendor side
router.get('/bid/:id', function(req, res){
    const userEmail = req.user.email;
    var id = req.params.id;
    var userProfile;
    //console.log(userEmail);
    User.find({"email" : userEmail}, {}, function(err,user){
        if(err){
            console.log("Error recieving the user data");
            console.log(err);
        } else { 
            userProfile = user[0];
            Event.find({"_id" : ObjectId(id)},{},function(err,event){
        
                if(err){
                    console.log("Error recieving the event data");
                    console.log(err);
                } else { 
                    res.render('bid', {
                        event: event[0],
                        userProfile: userProfile
                    })
                }
            });  
        }
    });
});

//get the bid and add it to the event and vendors tables to keep record of it

router.post('/bid/:id', function(req, res, next) {

    var id = req.params.id;
    
    var {vendorName,vendorPhoneNumber,vendorEmail,vendorWebsite,photographerCB,photographyBid,
            videographerCB,videographyBid,entertainmentCB,entertainmentBid,serviceDetailForm} = req.body;

    if(photographerCB!= "on"){
        photographyBid = 0;
    }

    if(videographerCB!= "on"){
        videographyBid = 0;
    }
    
    if(entertainmentCB!= "on"){
        entertainmentBid = 0;
    }
    

    var bidOffer = {
        vendorName: vendorName,
        vendorPhoneNumber: vendorPhoneNumber,
        vendorEmail: vendorEmail,
        vendorWebsite: vendorWebsite,
        photographyBid: Number(photographyBid),
        videographyBid: Number(videographyBid),
        entertainmentBid: Number(entertainmentBid),
        serviceDetailForm: serviceDetailForm
    };

    Event.updateOne( { "_id" : ObjectId(id) }, {$push: {vendorBidList:bidOffer}} , function(err, collection){
        if(err){
            console.log("Error Updating Information");
            console.log(err);
        }else {
            res.redirect('/dashboard');
        }
    }); 



    
   
    
});

//Filter for photography
router.get('/marketplace-photography', ensureAuthenticated, (req, res) =>{

    const userType = req.user.userType;
    var myFilter = null; 

    if(req.params.filterBy == "photography"){
        myFilter = ["Photography"];
    }else if(req.params.filterBy == "videography"){
        myFilter = ["Videography"];
    }else if(req.params.filterBy == "entertainment"){
        myFilter = ["Entertainment"];
    }

    if(userType=="vendor"){
        const vendorServiceList = req.user.vendorServiceList;
        
        if(req.query.search){
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Event.find({$and: [{"eventName": regex}, {vendorServiceList: { $in: myFilter }}]}, function(err, eventList){
                if(err){
                    console.log(err);
                } else {
                    if(eventList.length < 1) {
                        console.log("No Event Found");
                        res.redirect('/dashboard');
                    }else{
                        res.render('marketplace',
                        {eventList: eventList,
                        });
                    }
                }
            });
        }else{
            Event.find({vendorServiceList: { $in: myFilter }},function(err,eventList){
                if(err){
                    console.log("Error recieving the user list of events");
                    console.log(err);
                } else {
                    res.render('marketplace', 
                    {eventList: eventList,
                    }); 
                }
            });
        }
    }

});

//sorting
router.get('/sort/:sortBy', ensureAuthenticated, (req, res) =>{

    const userType = req.user.userType;
    var mySort = null;

    if (req.params.sortBy == "low"){
        mySort = {totalBudget: 1};
    }else if(req.params.sortBy == "high"){
        mySort = {totalBudget: -1};
    }else if(req.params.sortBy == "nearest"){
        mySort = {startDate: 1};
    }else if(req.params.sortBy == "furthest"){
        mySort = {startDate: -1};
    }

    if(userType=="vendor"){
        const vendorServiceList = req.user.vendorServiceList;
        
        if(req.query.search){
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Event.find({$and: [{"eventName": regex}, {vendorServiceList: {$in:vendorServiceList}}]}).sort(mySort).exec(function(err, eventList){
                if(err){
                    console.log(err);
                } else {
                    if(eventList.length < 1) {
                        console.log("No Event Found");
                        res.redirect('/dashboard');
                    }else{
                        res.render('marketplace',
                        {eventList: eventList,
                        });
                    }
                }
            });
        }else{
            Event.find({vendorServiceList: {$in:vendorServiceList}}).sort(mySort).exec(function(err,eventList){
                if(err){
                    console.log("Error recieving the user list of events");
                    console.log(err);
                } else {
                    res.render('marketplace', 
                    {eventList: eventList,
                    }); 
                }
            });
        }
    }
});

router.get('/eventBid/:id', function(req, res, next) {
    
    var id = req.params.id;
  

    Event.find({"_id" : ObjectId(id)},{},function(err,event){


        
        if(err){
            console.log("Error recieving the user list of events");
            console.log(err);
        } else {
            const vendorBidList = event[0].vendorBidList;
            const arrAvg = arr => (arr.reduce((a,b) => a + b, 0) / arr.length).toFixed(0)
            
            var photographyArr = []
            var videographyArr = []
            var entertainmentArr = []
            vendorBidList.forEach(function(vendor){
                if(vendor.photographyBid != null && vendor.photographyBid > 0){
                    photographyArr.push(vendor.photographyBid);
                }
                
                if(vendor.videographyBid != null && vendor.videographyBid > 0){
                    videographyArr.push(vendor.videographyBid);
                }

                if(vendor.entertainmentBid != null && vendor.entertainmentBid > 0){
                    entertainmentArr.push(vendor.entertainmentBid);
                }
            });

            
            res.render('hostEventBid', {
                vendorBidList: vendorBidList,
                photographyAvg: arrAvg(photographyArr),
                videographyAvg: arrAvg(videographyArr),
                entertainmentAvg: arrAvg(entertainmentArr)

            })
        
        }
    });  

});








module.exports = router;

