const path = require('path');

const express = require('express')

require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

const app = express();





dbConnection();

app.use(express.json());

app.use(cors());


app.use('/api/points', require('./routes/points'));
app.use('/api/puntosUsuarios', require('./routes/Puntos_Usuarios'));
app.use('/api/canjes', require('./routes/canjes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT || 4000}`);
});



