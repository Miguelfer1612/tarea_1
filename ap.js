const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 8005;

// Configuración de middlewares
app.use(express.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite');

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Ruta para obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
});

// Ruta para crear un nuevo usuario
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Ruta para actualizar completamente un usuario
app.put('/api/users/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

// Ruta para actualizar parcialmente un usuario (PATCH)
app.patch('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    // Construcción dinámica de la consulta SQL
    const fields = [];
    const values = [];
    for (let key in updates) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
    }
    values.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

// Ruta para eliminar un usuario
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
