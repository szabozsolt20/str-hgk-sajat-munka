db = db.getSiblingDB('videoStore');

db.movies.aggregate([{$count: "darab"}])
// print($darab)

/* (function () {
  cursor = db.movies.aggregate([{$count: "darab"}])
print($darab)
  while (cursor.hasNext()) {
    printjson(cursor.next());
  }
})();
 */