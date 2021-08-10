const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');
const bcrypt = require('bcryptjs');
const R = require('ramda');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  restaurantName: {type:String},
  location:  {type:String},
  pincode:  {type:Number},
  address: {type: String},
  profilePic: {type: String},
 
  created_at: { type: Date, default: Date.now, immutable: true },
  updated_at: { type: Date },
  
  menu :[
      {
          itemName: {type : String},
          price: {type: String}
      }
  ]
}, { versionKey: false 


});

// if (process.env.NODE_ENV !== 'test') {
//   MongooseAutoIncrementID.initialise('counters');

//   userSchema.plugin(MongooseAutoIncrementID.plugin, {
//     modelName: 'User',
//     field: 'user',
//     incrementBy: 1,
//     startAt: 1,
//     unique: true,
//     nextCount: false,
//     resetCount: false,
//   });
// }

// userSchema.virtual('full_name').get(function() {
//   if (this.first_name && this.last_name) {
//     return `${this.first_name} ${this.last_name}`;
//   }
//   if (this.first_name && !this.last_name) {
//     return this.first_name;
//   }
//   if (!this.first_name && this.last_name) {
//     return this.last_name;
//   }
//   return undefined;
// });

// userSchema.virtual('initials').get(function() {
//   return this.first_name && this.last_name && `${this.first_name[0].concat(this.last_name[0]).toUpperCase()}`;
// });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
