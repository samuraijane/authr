const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  name: {type: String},
  active: {type: Boolean},
  age: {type: Number}
});

characterSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    active: this.active,
    age: this.age
  };
}

const Character = mongoose.model('Character', characterSchema);

module.exports = {Character};
