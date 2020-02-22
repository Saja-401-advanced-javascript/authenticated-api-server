'use strict ';

const mongoose = require('mongoose');
require('../categories/categoryies-schema.js');

const products = mongoose.Schema({
    category: { type: String, required: true},
  name: { type: String, required: true },
//   displayName: { type: String, required: true },
//   description: { type: String, required: true}
}, {toObject: {virtuals: true}, toJSON: {vertuals: true}});


// products belong to a category (in the products schema) and the category has a name (foreignFeild which is from the categories schema),
// and this name will bring in an object that attach to the category property in the products schema
products.virtual('actualCategories',{
    ref : 'categories', // in categories schema our collection name is categories which is the string in the module,.export
    localField: 'category', // in the products schema
    foreignField: 'name',
    justOne: false
});

products.pre('findOne', function(){
    try{
        this.population('actualCategories');
    } catch(error){
        console.error(error);        
    }
})

module.exports = mongoose.model('products', products);