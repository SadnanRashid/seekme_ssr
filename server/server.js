import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../src/App";
const PORT = 8000;
const app = express();

app.use("^/$", (req, res) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.err(err);
      return res.status(500).send("Some error happened");
    }

    const html = ReactDOMServer.renderToString(<App />);

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
});

// app.use(express.static(path.resolve(__dirname, "..", "build")));
app.use(
  express.static(path.resolve(__dirname, "..", "build"), {
    maxAge: 31536000 * 1000,
  })
);

// Handle all other requests
app.get("*", (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log("App is launched");
});
