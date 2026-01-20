// Build configuration script
// Reads environment variables and generates configured index.html

const fs = require("fs");
const path = require("path");

// Read environment variables
require("dotenv").config();

const BASE_PATH = process.env.BASE_PATH || "/";

console.log(`Building with BASE_PATH: ${BASE_PATH}`);

// Read the template HTML
const templatePath = path.join(__dirname, "index.template.html");
const outputPath = path.join(__dirname, "index.html");

let html = fs.readFileSync(templatePath, "utf8");

// Replace all placeholders with actual base path
html = html.replace(/\{\{BASE_PATH\}\}/g, BASE_PATH);

// Write the configured HTML
fs.writeFileSync(outputPath, html);

console.log(`Generated index.html with BASE_PATH: ${BASE_PATH}`);
