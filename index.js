import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Kra@1234.com",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = results.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query(`INSERT INTO items(title) VALUES('${item}') RETURNING *`);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;

  await db.query(`UPDATE items SET title = '${title}' WHERE id = ${id}`);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const { deleteItemId } = req.body;
  await db.query(`DELETE FROM items WHERE id = ${deleteItemId}`);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
