const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();
app.use(cors());
app.use(express.json());
// login start
app.use('/api/auth', authRoutes);
// login end
// user start
app.use('/api', userRoutes);
// user end
// category start
app.use('/api/categories', categoryRoutes);
// category end
app.use(cors({
    origin: 'http://localhost:5173'
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
