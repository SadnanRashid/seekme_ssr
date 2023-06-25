import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom/server";
import App from "../src/App";
import logger from "./logger";

const PORT = 8000;

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "build")));

// Use the logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("*", (req, res, next) => {
  const routes = [
    // Add your route configurations here
  ];

  const match = routes.find((route) => matchPath(req.url, route));

  if (!match) {
    // If the requested URL doesn't match any routes, serve the React app
    const filePath = path.resolve(__dirname, "..", "build", "index.html");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Some error happened");
      }
      return res.send(
        data.replace(
          '<div id="root"></div>',
          `<div id="root">${ReactDOMServer.renderToString(
            <StaticRouter location={req.url}>
              <App />
            </StaticRouter>
          )}</div>`
        )
      );
    });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
  logger.info(`App launched on ${PORT}`);
});
