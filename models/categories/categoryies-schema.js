'use strict ';


const mongoose = require('mongoose');
require('../products/products-schema.js');

const categories = mongoose.Schema({
    name: { type: String, required: true },
    // displayName: { type: String, required: true },
    // description: { type: String, required: true }
}, { toObject: {virtuals: true}, toJSON: {virtuals: true}});
// virtuals : are attach to the both of the schemas 
categories.virtual('actualProducts', {
    ref: 'products', //collection name in the module.exports
    localField: 'name',// in the categories schema
    foreignField: 'category', // in the products schema
    justOne: false
});


// hook : for populating data, ex: populate this category with series of products, 
// the pre hook say before doing this (ex:findOne) go and do smth
categories.pre('findOne', function(){
    try{
        this.populate('actualProducts'); // actualProducts: vertula name, which is an object
        // populate : brings the data
    }catch(error){
        console.error(error);        
    }
})

// console.log('[[[[[[[[[[[[[', mongoose.model('categories', categories));

module.exports = mongoose.model('categories', categories); // 'categories' is the collection name