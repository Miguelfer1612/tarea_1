const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Resuelve la ruta a la base de datos
const dbPath = path.resolve(__dirname, 'database.sqlite');

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Inicializa la base de datos creando la tabla 'products' si no existe
const initDB = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla:', err.message);
      } else {
        console.log("Tabla 'products' creada o ya existente.");
      }
    });
  });
};

module.exports = {
  db,
  initDB
};
