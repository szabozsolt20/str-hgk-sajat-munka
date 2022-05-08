db = db.getSiblingDB('videoStore');

/* 
Készíts egy scriptet egy javaScript fájlban! A script feladata, hogy egyetlen függvényben lekérdezze a mozifilmek számát kimentve egy változóba, 
majd ennek segítségével egy ciklus keretében 3-asával lapozva írja ki a konzolra a filmek címeit és kategóriáit (kisbetűvel a kategóriát) 
a következő módon =>
pl.: „Terminator : action movie”
Minden egyes oldal alján jelenjen meg a szöveg: --page over--!
Segítségül egy lehetséges eredmény:
*/
// Elvi lehetőség még:
// https://www.mongodb.com/docs/manual/reference/method/cursor.skip/
// https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/

// https://www.mongodb.com/docs/manual/reference/method/#std-label-js-query-cursor-methods



  (function () {

     db.movies.find({}, { title: 1, category: 1, _id: 0 }).toArray().forEach((element, i) => {
      print(`${element.title}: ${element.category.toLowerCase()}`); 
     // printjson(element.title +": " + element.category.toLowerCase()); // is működik
     if (i % 3 == 2) {print("-- page over --")};

        });

  })()



//todo //////////// Alternatív próbák: //////////////////  
//db.movies.find().size()

/* (function () {
  let count = db.movies.count();
  let reziduum = count;
  let movies = db.movies.find({}, { title: 1, category: 1, _id: 0 }).toArray()

  while (reziduum > 3) {
    for (let i = 0; i < 3; i = i + 1) {
      printjson(movies[reziduum - i])
    }
    reziduum = reziduum - 3;
    printjson("-- page over --")
    if (reziduum <= 3) {
      for (let i = 0; i < 3; i = i + 1) {
        printjson(movies[reziduum - i])
      }
    }
  }
})()
 */

/*   (function () {
    let count = db.movies.count();
    let reziduum = count;



    while (reziduum > 3) {
      printjson(db.movies.find({}, { title: 1, category: 1, _id: 0 }).skip(count - reziduum).limit(3).toArray())
      reziduum = reziduum - 3;
      print("-- page over --")
      if (reziduum <= 3) {
        printjson(db.movies.find({}, { title: 1, category: 1, _id: 0 }).skip(count - reziduum).limit(3).toArray())
      }
    }
  })()
 */

  
// printjson((db.movies.find({}, {title: 1, category: 1, _id: 0}).toArray()))
// printjson((db.movies.aggregate([{$project: {category1: {$toLower: "$category"}, title: 1}}]).toArray()))

//db.movies.find({}, {title: 1, category: 1, _id: 0})


/*
db.movies.aggregate([{$count: "darab"}])
print($darab)
 (function () {
  cursor = db.movies.aggregate([{$count: "darab"}])
print($darab)
  while (cursor.hasNext()) {
    printjson(cursor.next());
  }
})();
 */