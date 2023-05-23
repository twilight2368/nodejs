const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    job: String
});

module.exports = mongoose.model('customers', customerSchema);