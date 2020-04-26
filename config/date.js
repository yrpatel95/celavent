//const dateFormat = require('dateformat');

module.exports = {
    addDate: function(date){
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate()+1);

        return newDate;
    }
    
}