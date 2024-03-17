import { allRepos } from "..";
import { CONFIG } from "../services/configService";
const path = require('path');
const express = require('express');
export const web = express();

// Set EJS as the view engine
web.set('views', path.join(__dirname, '/'));
web.set('view engine', 'ejs');
web.use(express.static('webUi'));

// Define routes
web.get('/', (req, res) => {
  // Render an EJS template
  let options = { 
    title: 'My EJS App', 
    sourceDir: CONFIG.source,
    projects: allRepos
  }
  res.render('index.ejs', options );
});

