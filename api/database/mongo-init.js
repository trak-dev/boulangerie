// Create the database and the collections
db = db.getSiblingDB('yummy-yams');

// Create the admin user
db.createUser({
  user: "api",
  pwd: "api",
  roles: [
    {
      role: "readWrite",
      db: "yummy-yams"
    }
  ]
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "email", "password", "pastriesWon", "triesNumber" ],
      properties: {
        name: {
          bsonType: "string",
          description: "user full name and is required"
        },
        email: {
          bsonType: "string",
          description: "unique email and is required"
        },
        password: {
          bsonType: "string",
          description: "user password and is required"
        },
        pastriesWon: {
          bsonType: "array",
          description: "array of pastries ID won by the user"
        },
        triesNumber: {
          bsonType: "int",
          description: "number of tries done (max 3)"
        },
      }
    }
  }
});

db.createCollection('pastries', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "image", "stock", "quantityWon"],
      properties: {
        name: {
          bsonType: "string",
          description: "name of the pastry and is required"
        },
        image: {
          bsonType: "string",
          description: "image src of the pastry and is required"
        },
        stock: {
          bsonType: "int",
          description: "number of pastries in stock and is required"
        },
        quantityWon: {
          bsonType: "int",
          description: "number of pastries won by users and is required"
        }
      }
    }
  }
});

db.pastries.insertMany([
    {
      "name": "Fondant suprême",
      "image": "fondant.jpeg",
      "stock": 4,
      "quantityWon": 0
    },
    {
      "name": "Cake tout Chocolat",
      "image": "cake-choco.jpeg",
      "stock": 3,
      "quantityWon": 0
    },
    {
      "name": "Cake Framboise chocolat",
      "image": "cake-framboise.jpeg",
      "stock": 4,
      "quantityWon": 0
    },
    {
      "name": "Brioche sucrée au chocolat",
      "image": "brioche-pain-perdu.jpeg",
      "quantityWon": 0,
      "stock": 3
    },
    {
      "name": "Boules vanille sur fondant au chocolat",
      "image": "glaces-vanille.jpeg",
      "stock": 2,
      "quantityWon": 0
    },
    {
      "name": "Éclair au chocolat",
      "image": "eclair.jpeg",
      "stock": 5,
      "quantityWon": 0
    },
    {
      "name": "Tarte poire chocolat",
      "image": "tarte-poire.jpeg",
      "stock": 5,
      "quantityWon": 0
    },
    {
      "name": "Banana split cerise",
      "image": "banana-split.jpeg",
      "stock": 3,
      "quantityWon": 0
    }
  ]);