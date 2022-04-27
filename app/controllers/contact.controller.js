const mongoose = require("mongoose");
const {BadRequestError} = require ("../errors");
const handLePromise = require("../helpers/promise.helper");
const Contact = require("../models/contact.model");
//Create and save a new contact 

exports.create = async (req, res, next ) => {
    // Validate request 
    if (!req.body.userId){
        return next(new BadRequestError(400, "Name can not be empty"));
    }
    //Create a contact 
    const contact = new Contact({
        userId: req.body.userId,
        address: req.body.address,
        title: req.body.title,
        id: req.body.id,
        completed: req.body.completed === true,
    });
    // Save contact in the database 
    const [error, document] = await handLePromise(contact.save());

    if (error) {
        return next(new BadRequestError(500,"An error occurred while creating the contacts"));
    }
    return res.send (document);
};
// Retrieve all contacts of a user from the database 
exports.findAll = async (req, res, next) => {
    const condition = { };
    const { userId } = req.query;
    if (userId) {
        condition.userId = { $regex: new RegExp(userId), $options: "i"};
    }

    const [error ,documents] = await handLePromise(Contact.find(condition));

    if (error) {
        return next(new BadRequestError(500, "An error occurred while retrieving contacts"));
    }

    return  res.send(documents);
};
// Find a single contact with an id
exports.findOne = async (req, res, next ) => {
    const {id} = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    const [error, document] = await handLePromise (Contact.findOne(condition));

    if (error){
        return next (new BadRequestError(500, `Error retreiving contact with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }
    return res.send(document);
};
//Update a contact by the id in the request 
exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next (new BadRequestError(400, "Data to update can not be empty"));
    }
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id: null,
    };

    const [error, document] = await handLePromise(
        Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if (error) {
        return next(new BadRequestError(500, `Error updating contact with id=${req.params.id}`));
    }

    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was updated successfully", });
};
//Delete a contact with the specified id in the request 
exports.delete = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id: null,
    };

    const [error, document] = await handLePromise(Contact.findOneAndDelete(condition));

    if (error) {
        return next(new BadRequestError(500, `Could not delete contact with id=${req.params.id}`));
    }
    if (!document) {
        return next(new BadRequestError(404, "Contact not found"));
    }

    return res.send({ message: "Contact was deleted successfully", });
};
//Find all completed contacts of a user
exports.findAllFavorite = async (req, res, next ) =>  {
    const [error, documents] = await handLePromise (
        Contact.find({completed: true, })
    );
    if (error){
        return next(new BadRequestError(500, "An error occurred while retrieving completed contacts"));
    }

    return res.send(documents);
};

// Delete all contacts of a user from the database 
exports.deleteAll = async (req, res, next) => {
    const [error, data] = await handLePromise(
        Contact.deleteMany({})
    );
    if (error){
        return next(new BadRequestError(500, "An error occurred while removing all contacts"));
    }

    return res.send({
        message: `${data.deletedCount} contacts were deleted successfully`, 
    });
};
