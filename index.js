import express from "express";
import cors from "cors";
import { 
    prepareHATEOAS, 
    showJoyas,
    filterJoyas 
} from "./querys.js";

const app = express();
const PORT = 4052;

app.use(express.json());
app.use(cors());

app.listen(PORT, console.log("SERVIDOR ENCENDIDO"));

app.get("/joyas", async (req, res) => {
  const queryStrings = req.query;
  try {
    const joyas = await showJoyas(queryStrings);
    const HATEOAS = await prepareHATEOAS(joyas);
    res.json(HATEOAS);
    res.status(200);
    console.log(
      `Consulta exitosa.  Se consultó la ruta: ${req.method} ${req.url} ${new Date()}`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/joyas/filtros', async (req, res) => {
    const queryStrings = req.query 
    try {
        const joyas = await filterJoyas(queryStrings)
    res.json(joyas) 
         res.status(200);
    console.log(
      `Consulta exitosa.  Se realizo un filtro en : ${req.method} ${req.url}  ${new Date().toLocaleString()} se mostraron ${joyas.length} resultados`)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }})
    


app.use((req, res) => {
  res.status(404).send("Lo siento, no se encontró la ruta indicada 😔");
});
