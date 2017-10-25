const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Character} = require('./model');

router.delete('/:id', (req, res) => {
  Character
    .findByIdAndRemove(req.params.id, function(err, value) {
      if(err) {
        const message = `It appears that the document with id (${req.params.id}) does not exist.`;
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .exec()
    .then( character => {
      const message = `204 / The document with id ${req.params.id} has been deleted`;
      console.log(message);
      return res.json(message).end();
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/', (req, res) => {
  Character
    .find()
    .exec()
    .then(characters => {
      res.json({
        characters: characters.map( character => character.apiRepr() )
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
  Character
    .findById(req.params.id)
    .exec()
    .then( character => {
      res.json({
        characters: character.apiRepr()
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['name', 'active', 'age'];
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `The value for \`${field}\` is missing.`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Character
    .create({
      name: req.body.name,
      active: req.body.active,
      age: req.body.age
    })
    .then(
      character => res.status(201).json(character.apiRepr())
    )
    .catch(err => {
      console.error(err);
      return res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {  //p002
  if(req.params.id !== req.body.id) {
    const message = `The request path (${req.params.id}) and the request body id (${req.body.id}) must match.`;
    console.error(message);
    return res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['name', 'active', 'age'];
  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Character
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then( character => res.json(204).end() )
    .catch(err => {
      console.error(err);
      return res.status(500).json({message: 'Internal server error'})
    });
});

module.exports = {router};
