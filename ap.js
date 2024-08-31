const express = require('express');
const { db, initDB } = require('./database');  // Importar la base de datos y la función initDB
const app = express();
const port = 8005;  // Cambiar el puerto a 8005

// Inicializar la base de datos
initDB();

// Configuración de middlewares
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Ruta para obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
});

// Ruta para crear un nuevo producto
app.post('/api/products', (req, res) => {
    const { name, description, price, stock } = req.body;
    db.run('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', [name, description, price, stock], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Ruta para actualizar completamente un producto
app.put('/api/products/:id', (req, res) => {
    const { name, description, price, stock } = req.body;
    const id = req.params.id;
    db.run('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', [name, description, price, stock, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

// Ruta para actualizar parcialmente un producto (PATCH)
app.patch('/api/products/:id', (req, res) => {
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

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

// Ruta para eliminar un producto
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`API listening at http://0.0.0.0:${port}`);
});
