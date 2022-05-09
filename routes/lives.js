const { Router } = require("express");
const pool = require("../db");

const router = Router();

router.get("/", (request, response, next) => {
  pool.query("SELECT * FROM lives", (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

router.get("/conditions", (request, response, next) => {
  pool.query("SELECT * FROM lives JOIN habitats ON habitats.name = lives.habitat", (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

router.get("/:id", (request, response, next) => {
  const { id } = request.params;
  pool.query("SELECT * FROM lives WHERE id = $1", [id], (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

router.post("/", (request, response, next) => {
  const { monster, habitat } = request.body;
  pool.query(
    "INSERT INTO habitats(monster, habitat) VALUES($1, $2,)",
    [monster, habitat],
    (err, res) => {
      if (err) return next(err);

      response.redirect("/lives");
    }
  );
});

router.put("/:id", (request, response, next) => {
  const { id } = request.params;
  const keys = ["monster", "habitat"];
  const fields = [];

  keys.forEach((key) => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, idx) => {
    pool.query(
      `UPDATE lives SET ${field}=($1) WHERE id=($2)`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(err);

        if (idx === fields.length - 1) response.redirect("/lives");
      }
    );
  });
});

router.delete("/:id", (request, response, next) => {
  const { id } = request.params;
  pool.query("DELETE FROM lives WHERE id=($1)", [id], (err, res) => {
    if (err) return next(err);

    response.redirect("/lives");
  });
});

module.exports = router;
