db = db.getSiblingDB('videoStore')

db.createCollection("directors", {
  validator: {
    $jsonSchema: {
      required: ["_id", "name", "birthYear", "movies"],
      properties: {
        _id: { bsonType: "int" },
        name: { enum: ["Steven Spielberg", "Clint Eastwood", "James Cameron"] },
        birthYear: { bsonType: "int" },
        movies: { bsonType: "array" }
      }
    }
  }
});

db.directors.insertOne({ _id: NumberInt(1), name: "Steven Spielberg", birthYear: NumberInt(1951), movies: [] });
db.directors.insertOne({ _id: NumberInt(2), name: "Clint Eastwood", birthYear: NumberInt(1952), movies: [] });
db.directors.insertOne({ _id: NumberInt(3), name: "James Cameron", birthYear: NumberInt(1953), movies: [] });


// 4.feladat
// db.directors.find()
// db.movies.find({}, {director: 1})
var moviesCE = [
  ObjectId("6276a1fe3de70ba9f6e37205"),
  ObjectId("6276a1fe3de70ba9f6e37206"),
  ObjectId("6276a1fe3de70ba9f6e37208"),
  ObjectId("6276a1fe3de70ba9f6e3720a"),
  ObjectId("6276a1fe3de70ba9f6e3720b"),
  ObjectId("6276a1fe3de70ba9f6e3720c")]
var moviesSS = [ObjectId("6276a1fe3de70ba9f6e37204"), ObjectId("6276a1fe3de70ba9f6e37207")]
var moviesJC = [ObjectId("6276a1fe3de70ba9f6e37203"), ObjectId("6276a1fe3de70ba9f6e37209")]

//var dirs = ["Clint Eastwood", "Steven Spielberg", "James Cameron"]
moviesCE.forEach(id => db.directors.updateOne({ name: "Clint Eastwood" }, { $push: { movies: id } }));
moviesSS.forEach(id => db.directors.updateOne({ name: "Steven Spielberg" }, { $push: { movies: id } }));
moviesJC.forEach(id => db.directors.updateOne({ name: "James Cameron" }, { $push: { movies: id } }));

// 5.feladat
(function () {
  cursor = db.directors.find().pretty()
  while (cursor.hasNext()) {
    printjson(cursor.next());
  }
})()
//https://www.mongodb.com/docs/manual/tutorial/write-scripts-for-the-mongo-shell/


// 6.feladat


db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      required: ["title", "category"], // kivettem a director-t
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

db.movies.updateMany({},{$unset:{director:''}})

// 7.feladat-hoz:

// Egyedi évszámokat adok a sorszámuk alapján a szűrések miatt
var tomb = db.movies.find().toArray();
tomb.forEach(element => {
  db.movies.updateOne({ title: element.title }, {
    $set: {
      releaseYear: NumberInt(
        2000 + tomb.indexOf(element))
    }
  })
});

// 7-10. feladat, szűrések:

(function () {
  const cursor = [
    //2004 előttiek:
    db.movies.find({ releaseYear: { $lt: 2004 } }),
    //2004 utániak:
    db.movies.find({ releaseYear: { $gt: 2004 } }),
    // 2002 és 2008 közöttiek:
    db.movies.find({ releaseYear: { $gt: 2004, $lt: 2008 } }),
    db.movies.find({ $and: [{ releaseYear: { $gt: 2004 } }, { releaseYear: { $lt: 2008 } }] }),
    // 2002 és 2008 közöttiek "ROMANTIC" kategóriával:
    db.movies.find({ $and: [{ releaseYear: { $gt: 2004 } }, { releaseYear: { $lt: 2008 } }, { category: "ROMANTIC" }] }),
    // nem "FANTASY" kategóriásak:
    db.movies.find({ category: { $ne: "FANTASY" } })
  ]
  cursor.forEach(c => {
    while (c.hasNext()) {
      printjson(c.next());
    }
  }
  )
})()



/*
db.directors.updateOne({ name: "Steven Spielberg" }, { $push: { movies: ObjectId("6276a1fe3de70ba9f6e37204") } }, { $push: { movies: ObjectId("6276a1fe3de70ba9f6e37207") } });
db.directors.updateOne({ name: "James Cameron" }, { $push: { movies: ObjectId("6276a1fe3de70ba9f6e37203") } }, { $push: { movies: ObjectId("6276a1fe3de70ba9f6e37209") } });
db.directors.updateOne({ name: "Clint Eastwood" }, {
  $push: { moviesCE
     movies: [
      ObjectId("6276a1fe3de70ba9f6e37205"),
      ObjectId("6276a1fe3de70ba9f6e37206"),
      ObjectId("6276a1fe3de70ba9f6e37208"),
      ObjectId("6276a1fe3de70ba9f6e3720a"),
      ObjectId("6276a1fe3de70ba9f6e3720b"),
      ObjectId("6276a1fe3de70ba9f6e3720c")]

 }
});
 */

/* var lookup = db.directors.aggregate([
  {
    $lookup:
    {
      from: 'movies',
      localField: 'name',
      foreignField: 'director',
      as: 'dir'
    }
  }
]).toArray();


//a flat()-et nem ismeri
var id_tomb = lookup.map(director => director.dir).flat().map(d => d._id)
 */

