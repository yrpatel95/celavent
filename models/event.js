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
    budget: {
        type: String,
        required: true
    },
    eventLength: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: false
    },
    userEmail: {
        type: String,
        required: true
    }


});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;