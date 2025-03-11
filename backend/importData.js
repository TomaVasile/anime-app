const mongoose = require('mongoose');
const Anime = require('./models/anime');
const User = require('./models/user'); // Importă modelul User
const animeData = require('./animeData.json'); // Datele pentru anime

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Conectat la MongoDB');
    
    // Șterge toate anime-urile și utilizatorii înainte de a importa noile date
    await Anime.deleteMany();
    await User.deleteMany(); // Șterge utilizatorii înainte de a-i adăuga pe cei noi

    // Adaugă toate anime-urile din fișierul JSON
    await Anime.insertMany(animeData);

    // Adaugă toți utilizatorii din fișierul JSON
    await User.insertMany(userData);

    console.log('Datele au fost importate cu succes!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Eroare la conectare:', err);
  });
