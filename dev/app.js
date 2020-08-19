const express = require('express');
const hbs = require('hbs');
const proxy = require('http-proxy-middleware');
const port = 3000;

// init app
const app = express();

// proxy bundle/websocket requests to webpack dev server
if (process.env.mode && process.env.mode === 'dev') {
    app.use('/sockjs-node', proxy({target: 'http://localhost:3001/', ws: true}));
    app.use('/dist', proxy({target: 'http://localhost:3001/', ws: true}));
} else {
    app.use('/dist', express.static(__dirname + '/../dist')); // prod
}

// configure handlebars
app.set('views', __dirname + '/../src/views');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/../src/partials');

// define static paths
app.use('/samples', express.static(__dirname + '/../src/samples'));
app.use('/queries', express.static(__dirname + '/../src/queries'));

// define locals
hbs.localsAsTemplateData(app);
app.locals.titleSuffix = ' - Departement Omgeving - Linked Data';

// define routes
app.get('/', (req, res) => {
    res.render('department', {
        title: 'Departement Omgeving',
        titleSuffix: ' - Linked Data',
    });
});

app.get('/zendantennes/home', (req, res) => {
    res.render('zendantennes-home', {
        title: 'Zendantennes'
    });
});

app.get('/id/straling', (req, res) => {
    res.render('collection-straling', {
        title: 'Straling'
    });
});

app.get('/id/resource/1', (req, res) => {
    res.render('resource-1', {
        title: 'Integraal Milieu Jaarverslag - Dossier - 2011 - EXXONMOBIL CHEMICAL BELGIUM - 01749024006625',
        uri: 'https://data.imjv.omgeving.vlaanderen.be/id/dossier/2011_01749024006625'
    });
});

app.get('/query-results', (req, res) => {
    res.render('query-results', {
        title: 'SPARQL zoekopdracht resultaten'
    });
});

app.get('/ontology', (req, res) => {
    res.render('ontology', {
        title: 'Ontology'
    });
});

app.listen(port, () => console.log(`Dev server listening on port ${port}!`));
