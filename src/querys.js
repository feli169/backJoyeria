import { Pool } from "pg";
import format from "pg-format";

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'joyas',
    allowExitOnIdle: true
})


export async function prepareHATEOAS(joyas) {
  const results = joyas
    .map((joya) => {
      return {
        name: joya.nombre,
        href: `/joyas/joya/${joya.id}`,
      };
    })
    .slice(0, 2);
  const total = joyas.length;
  const HATEOAS = { total, results };
  return HATEOAS;
}

export async function showJoyas({
  limits = 9,
  order_by = "id_ASC",
  page = 1,
}) {
  const [fields, direction] = order_by.split("_");
  const offset = (page - 1) * limits;
  const formattedQuery = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    fields,
    direction,
    limits,
    offset
  );
  pool.query(formattedQuery);
  const { rows: inventario } = await pool.query(formattedQuery);
  return inventario;
}

export async function filterJoyas({
  precio_max,
  precio_min,
  categoria,
  metal,
}) {
  let Filters = [];
  const values = [];
  const addFilter = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = Filters;
    Filters.push(`${campo} ${comparador} $${length + 1}`);
  };
  if (precio_max) addFilter("precio", "<=", precio_max);
  if (precio_min) addFilter("precio", ">=", precio_min);
  if (categoria) addFilter("categoria", "=", categoria);
  if (metal) addFilter("metal", "=", metal);

  let consulta = "SELECT * FROM inventario";
  
  if (Filters.length > 0) {
    Filters = Filters.join(" AND ");
    consulta += ` WHERE ${Filters}`;
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
}