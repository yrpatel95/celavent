const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    venueName: {
        type: String,
        required: true
    },
    venueCity: {
        type: String,
        required: true
    },
    venueState: {
        type: String,
        required: true
    },
    eventLength: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    startDateDisplay: {
        type: String,
        required: false
    },
    endDateDisplay: {
        type: String,
        required: false
    },
    userEmail: {
        type: String,
        required: true
    },
    vendorServiceList: {
        type: Array,
        required: true
    },
    photographyBudget: {
        type: Number,
        required: false
    },
    videographyBudget: {
        type: Number,
        required: false
    },
    entertainmentBudget: {
        type: Number,
        required: false
    },
    totalBudget: {
        type: Number,
        required: false
    },
    guestCount: {
        type: Number,
        required:true
    },
    eventSpaceLocation: {
        type: String,
        required:true
    },
    extraDetailForm: {
        type: String,
        required:false
    }

});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;