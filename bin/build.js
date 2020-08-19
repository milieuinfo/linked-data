const fs = require('fs');
let builder = require('@bnowack/deployer').builder;

builder
    .init({
        path: './demo',
        version: JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version,
    })
    .resetDirectory('./demo')
    .copy('dist', `demo/dist`)
    .copy('src/queries', `demo/queries`)
    .copy('src/samples', `demo/samples`)
    .copy('dev/sample.htaccess', `demo/.htaccess`)
    .copy('http://localhost:3000/', 'demo/index.html')
    .copy('http://localhost:3000/zendantennes/home', 'demo/views/zendantennes-home.html')
    .copy('http://localhost:3000/id/straling', 'demo/views/resource-list-straling.html')
    .copy('http://localhost:3000/id/resource/1', 'demo/views/resource.html')
    .copy('http://localhost:3000/query-results', 'demo/views/query-results.html')
    .copy('http://localhost:3000/ontology', 'demo/views/ontology.html')
;
