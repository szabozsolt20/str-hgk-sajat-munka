// ezeket a megoldásokat(parancsokat) - a rövidebb kód érdekében) közvetlenül a shell-ben futtatásra szántam (nem js-ből load()-olva):

// 2. feladat: Számold meg, hány akció- és romantikus filmed van összesen!
db.movies.aggregate([
  {
    $match: { $or: [{ category: "ROMANTIC" }, { category: "ACTION" }] }
  },
  { $count: "Szumma" }
])


// 3. feladat: Kérdezd le a „FANTASY” filmek nevét és a kategóriáját. Mentsd le a listát (Cursor-t) egy változóba!
var fantasy = db.movies.find({ category: "FANTASY" });

// 4. feladat: kiírja filmek a nevét és kategóriáját:
var all = db.movies.find().toArray()
all.forEach(movie => {
  print(`${movie.title}: ${movie.category}`)
})

// 5. feladat:  fordított sorrendben (_id) adja vissza csak a filmcímeket!
db.movies.find({}, { title: 1, _id: 0 }).sort({ title: -1 })

// 6.feladat: a kategóriák szerint rakja sorba az elemeket, majd utána a megjelenés éve szerint 
// fordítva sorolja fel! A lekérdezés csak a film címét, kategóriáját és megjelenési évét adja vissza.
db.movies.find({}, { title: 1, category: 1, releaseYear: 1, _id: 0 }).sort({ category: 1, releaseYear: -1 })

// 7.feladat: 
db.movies.find({ category: "ACTION" }).sort({ releaseYear: -1 })[0]

// 8. feladat: a két legrégebben készült film címét és gyártási évét!
db.movies.find({}, { title: 1, releaseYear: 1, _id: 0 }).sort({ releaseYear: 1 }).limit(2)

// 9. feladat: a ROMANTIC kategóriából a második legfrissebben megjelent film nevét és megjelenési évét!
db.movies.find({category: "ROMANTIC"}, { title: 1, releaseYear: 1, _id: 0 }).sort({releaseYear: -1}).skip(1).limit(1)









var cursor = db.movies.find({}, { title: 1, releaseYear: 1, _id: 0 }).sort({ releaseYear: 1 }).toArray()
cursor.forEach(movie => {if })


for (let i = 0; i < 5; i++) {
  cursor[i]
}
//db.movies.find({}, {title:1, releaseYear: 1, _id:0}).sort({releaseYear: 1})[i]



db.movies.aggregate([{ $match: {} }, { $sort: { title: -1 } }])


use videoSore