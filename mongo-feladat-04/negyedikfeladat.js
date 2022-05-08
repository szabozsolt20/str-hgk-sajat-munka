db = db.getSiblingDB('videoStore');
// 0.feladat:
// https://www.digitalocean.com/community/tutorials/how-to-use-schema-validation-in-mongodb

db.createCollection("cinemas", {
  validator: {
    $jsonSchema: {
      required: ["_id", "name", "movies", "address"],
      properties: {
        _id: { bsonType: "int" },
        name: { bsonType: "string", pattern: "[A-Z].*" },
        movies: { bsonType: "array" },
        address: { bsonType: "object", description: "majd elég egy city mezővel játszan", required: ["city"], properties: { city: { bsonType: "string" } } },
      }
    }
  }
});

// 1.feladat: a cinema listánk rendelkezzen 3 cinema dokumentummal.
// tömbbe is kiszervezhettük volna.

db.cinemas.insertMany([
  {
    _id: NumberInt(1),
    name: "Cinema_1",
    movies: [ObjectId("6276a1fe3de70ba9f6e37203"), ObjectId("6276a1fe3de70ba9f6e37204"), ObjectId("6276a1fe3de70ba9f6e37205")],
    address: { city: "Budapest" }

  },
  {
    _id: NumberInt(2),
    name: "Cinema_2",
    movies: [ObjectId("6276a1fe3de70ba9f6e37203"), ObjectId("6276a1fe3de70ba9f6e37204"), ObjectId("6276a1fe3de70ba9f6e37206")],
    address: { city: "Debrecen" }

  },
  {
    _id: NumberInt(3),
    name: "Cinema_3",
    movies: [ObjectId("6276a1fe3de70ba9f6e37203"), ObjectId("6276a1fe3de70ba9f6e37207"), ObjectId("6276a1fe3de70ba9f6e37208")],
    address: { city: "Kecskemét" }

  }
]);

// 2-3. feladat: Kérdezzük le, hogy az első helyen lévő mozink milyen filmeket játszik, jelenjen meg minden film tulajdonsága!

db.cinemas.aggregate([
  {
    $match:
    {
      name: "Cinema_1"
    }
  },

  {
    $lookup:
    {
      from: 'movies',
      localField: 'movies',
      foreignField: '_id',
      as: 'films'
    }
  },
  {
    //$project: { "films": 1, '_id': 0 } // 2. feladat
    $project: { "films.title": 1, '_id': 0 } // 3. feladat
  }
]).pretty()

// 4. feldat:
// másodikfeldat.js/4. feldatban elvégezve.#scripting

// 5. feldat: Kérdezzük le az egyik rendező által rendezett filmek adatait!

db.directors.aggregate([
  {
    $match: { name: "Clint Eastwood" }
  },
  {
    $lookup: {
      from: 'movies',
      localField: 'movies',
      foreignField: '_id',
      as: 'films'

    }
  }
]).pretty()


// 6. feldat: érdezzük le egy másik rendező filmjeit úgy, hogy csak a rendező neve és a filmek „title”-jei, vagyis címei jelennek meg (tipp: $project operátor)!

db.directors.aggregate([
  {
    $match: { name: "Clint Eastwood" }
  },
  {
    $lookup: {
      from: 'movies',
      localField: 'movies',
      foreignField: '_id',
      as: 'films'

    }
  },
  {
    $project: { "_id": 0, "name": 1, "films.title": 1 }
  }
]).pretty()

// 7. feladat: Adj pár szavazatot egy-egy filmre ("ratings"), ha még nem tetted meg. Írj egy lekérdezést az aggregáció segítségével, 
// amely visszaadja annak a filmnek a címét, amely a legjobb átlagszavazattal rendelkezik! Két mezőt adjon vissza: "title" és egy új mező: 
// "rateAvg" => pl.: { "title" : "E.T.", "rateAvg" : 4.5 }. Csak aggregációt használj, Cursor metódusok használata nélkül!

db.movies.aggregate([
  {
    $project: { "title": 1, "_id": 0, rateAvg: { $avg: "$ratings" } }
  },
  { $sort: { rateAvg: -1 } },
  { $limit: 1 }
])
