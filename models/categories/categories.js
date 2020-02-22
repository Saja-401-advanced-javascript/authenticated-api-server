'use strict ';


/**
 * Class representing a categories Item.
 * @extends dataModel
 */

const schema = require('./categoryies-schema.js');
const dataModel = require('../models.js');

class Categories extends dataModel{};

// console.log('ddddddddddd', dataModel);

module.exports = new Categories(schema)