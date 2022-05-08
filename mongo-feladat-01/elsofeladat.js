// import { movieList } from "./movielist.js";

db = db.getSiblingDB('videoStore')
// db = connect("localhost:27017/videoStore");
// https://www.mongodb.com/docs/manual/tutorial/write-scripts-for-the-mongo-shell/#scripting
// https://stackoverflow.com/questions/71826660/mongo-shell-command-not-accept-use-db-command

// https://www.mongodb.com/docs/manual/core/schema-validation/
// https://www.digitalocean.com/community/tutorials/how-to-use-schema-validation-in-mongodb
db.createCollection("movies", {
  validator: {
    $jsonSchema: {
      required: ["title", "category", "director"],
      properties: {
        title: { bsonType: "string", pattern: "[A-Z].*" },
        category: { enum: ["fantasy", "action", "romantic", "FANTASY", "ACTION", "ROMANTIC"] },
        director: { enum: ["Steven Spielberg", "Clint Eastwood", "James Cameron"] },
        // ratings: {bsonType: ["array"], items:{bsonType: "int", minimum: 1, maximum: 5} }
      }
    }
  }
});

(function saveMovies() {
    const movieList = [
      {
        title: "Dave Chappelle: For What it's Worth",
        category: "romantic",
        director: "James Cameron"
      }, {
        title: "Killers",
        category: "fantasy",
        director: "Steven Spielberg"
      }, {
        title: "Anatomy (Anatomie)",
        category: "romantic",
        director: "Clint Eastwood"
      }, {
        title: "The Happy Road",
        category: "romantic",
        director: "Clint Eastwood"
      }, {
        title: "Follow the Fleet",
        category: "fantasy",
        director: "Steven Spielberg"
      }, {
        title: "Breathing Room",
        category: "action",
        director: "Clint Eastwood"
      }, {
        title: "Gorko!",
        category: "romantic",
        director: "James Cameron"
      }, {
        title: "Momma's Man",
        category: "fantasy",
        director: "Clint Eastwood"
      }, {
        title: "Dream (Bi-mong)",
        category: "fantasy",
        director: "Clint Eastwood"
      }, {
        title: "They Only Kill Their Masters",
        category: "action",
        director: "Clint Eastwood"
      }]
  
  db.movies.insertMany(movieList);
})();

db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      required: ["title", "category", "director"],
      properties: {
        title: { bsonType: "string", pattern: "[A-Z|0-9].*" },
        category: { enum: ["fantasy", "action", "romantic", "FANTASY", "ACTION", "ROMANTIC"] },
        director: { enum: ["Steven Spielberg", "Clint Eastwood", "James Cameron"] },
        ratings: { bsonType: ["array"], items: { bsonType: "int", minimum: 1, maximum: 5 } }
      }
    }
  },
  validationLevel: "moderate"
})


db.movies.updateMany({}, { $set: { ratings: [] } });

// db.movies.updateOne({ title: "Anatomy (Anatomie)" }, { $push: { ratings: NumberInt(5) } }); // alap eset. Alább: több tömbelemmel bővítés:
db.movies.updateOne({ title: "Dave Chappelle: For What it's Worth" }, { $push: { ratings: {$each: [NumberInt(1), NumberInt(2), NumberInt(3)]}} } );
db.movies.updateOne({ title: "Killers" }, { $push: { ratings: {$each: [NumberInt(2), NumberInt(3), NumberInt(4)]}} });
db.movies.updateOne({ title: "Anatomy (Anatomie)" }, { $push: { ratings: {$each: [NumberInt(3), NumberInt(4), NumberInt(5)]}} });

db.movies.updateMany({}, { $set: { releaseYear: 2000 } });

db.movies.updateMany({}, [{ $set: { category: { $toUpper: "$category" } } }]);



/* 
// Alternatív megoldás a teljes felűlírás helyett:
// Validátor hozzáadása meglévő kollekcióhoz:

let previousValidator = db.getCollectionInfos({name: "movies"})[0].options.validator;
// push the key to required array
previousValidator.$jsonSchema.required.push("ratings")

let ratingTipus = { bsonType: ["array"], items: { bsonType: "int", minimum: 1, maximum: 5 }, "description" : "valami leírás" }
// add new property to validator
previousValidator.$jsonSchema.properties['ratings'] = ratingTipus

db.runCommand({
  "collMod": "movies",
  "validator": previousValidator,
});

// 1. A db.getCollectionInfos metódussal kolvasod a meglévő validátort.
// 2. Felveszed a kívánt mezőt a kötelezők közé (required).
// 3. Beállítod a mező típusát, leírását, esetleges további validátorait.
// 4. A db.runCommand segítségével felülírod a meglévő validátort.
 */
