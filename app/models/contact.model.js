const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Contact name is required"],
    },
    address: String,
    title: {
        type: String,
        trim: true,
        lowercase: true,
    },
    
    //id: String,
    completed: Boolean,
}, { timestamps: true });

//Replace _id with id and remove _V
schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("contact", schema);