import pkg from 'cors';
const { cors } = pkg;
import express from 'express'
import steamRoutes from './Routes/Steam.js'
import weatherRoutes from './Routes/Weather.js'
import cinemaRoutes from './Routes/Cinema.js'
import pokemonRoutes from './Routes/pokemon.js'
import authenticateRoutes from './Routes/Authenticate.js';
import createEntryRoute from './Routes/Create_Entry.js';
import widgetRoutes from './Routes/Widget.js';
import getInfoDbRoutes from './Routes/GetInfoDb.js';
import aboutRoutes from './Routes/About.js';
import locationRoutes from './Routes/Location.js';
import giphyRoutes from './Routes/Giphy.js';

const app = express()
const port = 8080
app.use(express.json())
app.use('/', steamRoutes);
app.use('/', weatherRoutes);
app.use('/', cinemaRoutes);
app.use('/', pokemonRoutes);
app.use('/', authenticateRoutes);
app.use('/', locationRoutes);
app.use('/create_entry', createEntryRoute)
app.use('/widget', widgetRoutes)
app.use('/', getInfoDbRoutes);
app.use('/', aboutRoutes);
app.use('/', giphyRoutes);
app.use(pkg());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})