Omgeving Linked Data UI
=========================

UI components for Departement Omgeving's Linked Data websites.

## Development

* Run `yarn install` (or `npm install`) to install/update dependencies.
* Run `npm run app-dev` to activate the development server (with webpack websocket support).
* Run `npm run ui-dev` to activate the webpack bundler/watcher.

## Release creation

* Increase the `version` in `package.json`
* Run `npm run app-prod` to start the build-compatible app server.
* Run `npm run ui-prod` to build a production-optimized distribution in `/dist`.
* Run `npm run build` to update the `demo` directory.

## Static demo app

* There is an Apache-compatible demo application in `/demo` (the contents need to be installed in a root directory to work).

## Setup and installation on the target server

* Copy the `/dist` directory to `/dist` on the target webserver.
* Copy the `/queries` directory to `/queries` on the target webserver.
* There is a footer snippet at `/src/partials/footer.html` which can be used in your layout template (see `src/views/layout.hbs` for an example base layout).
* Adjust any favicon link in your layout template to point at `/dist/img/favicon.ico`.
* Optional: You can use a `#header` div for arbitrary markup (or some SEO links). It will be auto-replaced with a more optimized header (including links to the department website).  
* There is an initialization snippet at `src/partials/init.html` which should be included in your layout template as very last section in the `body` tag.
* Wrap the markup in `#content` with an `ld-view` tag:

        <div id="content">
            <ld-view>
                ...
            </ld-view>
        </div>
 
    Inside `<ld-view>`, any of the available components (see below) can now be used. JavaScript and CSS dependencies will be lazy-loaded on demand from `/dist`.
* Add an `about` attribute with the current subject's URI to the `body` tag.
  Alternatively, add `about` attributes to [`<ld-subject>`](#ld-subject) tags.

## Limitations

* At the moment, the components should not be mixed with the [jQuery-based Linked Data widgets](https://gitlab.com/bnowack/lnedata-ui). 
* The base URL of the the target site should be `/` (for running the code in a sub-directory, another build configuration would be needed).

## Components

See `src/views/*.hbs` for usage examples.

Available components:

* [flex-container](#flex-container)
* [flex-item](#flex-item)
* [ld-accordion](#ld-accordion)
* [ld-card](#ld-card)
* [ld-card-content](#ld-card-content)
* [ld-card-title](#ld-card-title)
* [ld-collapsible](#ld-collapsible)
* [ld-data-table](#ld-data-table)
* [ld-lookup-form](#ld-lookup-form)
* [ld-map](#ld-map)
* [ld-object](#ld-object)
* [ld-predicate](#ld-predicate)
* [ld-search-form](#ld-search-form)
* [ld-sparql-form](#ld-sparql-form)
* [ld-subject](#ld-subject)
* [ld-taxonomy](#ld-taxonomy)
* [ld-view](#ld-view)
 
### `<flex-container>`

* Creates a flex container for horizontally positioned sub-items.
* Add `stretch` class to make all children expand to the same height. (Use this only in nested containers, not on a top-level `flex-container`, or it may expand to the page height).
* Example:

        <flex-container>
            <flex-item dsk="66" mob="100">
                66% wide on desktops, 100% on mobiles
            </flex-item>
            <flex-item dsk="33" mob="100">
                33% wide on desktops, 100% on mobiles
            </flex-item>
        </flex-container>


### `<flex-item>`

* To be used as direct child nodes within a `flex-container`.
* Supports `dsk` (desktop) `tab` (tablet), and `mob` (mobile) attributes for specifying respective item widths.
  * Supported values are `25`, `33`, `50`, `66`, `75`, and `100`.
  * If a value is not specified, it is inherited from the higher context (e.g. `mob` inherits from `tab`), with `dsk` defaulting to 100%.
* Example:

        <flex-item dsk="25" tab="50", mob="100">
            25% wide on desktops, 50% on tablets, 100% on mobiles
        </flex-item>


### `<ld-accordion>`

* Turns its direct child nodes into collapsible sections.
* The child nodes should have two sibling nodes: One node with a `pane-toggle` class, and one with a `pane` class.
  * The former will be used to toggle the latter.
  * API form components provide these classes internally, so that they can be used directly as child nodes.
  * Example:

        <ld-accordion>
            <ld-lookup-form
                    samples="/samples/imjv-lookup.txt">
                Opzoeken op basis van identifier
            </ld-lookup-form>

            <ld-sparql-form
                    endpoint="https://id.milieuinfo.be/imjv/sparql"
                    samples="/samples/imjv-sparql.txt">
                Opzoeken met een SPARQL zoekopdracht
            </ld-sparql-form>

            <ld-search-form
                    endpoint="https://id.milieuinfo.be/imjv/keywordsearch"
                    samples="/samples/imjv-search.txt">
                Opzoeken met een sleutelwoord
            </ld-search-form>
        </ld-accordion>


### `<ld-card>`

* Renders a basic card.
* Supports a `dark` class for a card with a dark background (and white text).
* Example:

        <ld-card>
            <ld-card-title class="dark">
                <h2>Welkom op Zendantennes</h2>
            </ld-card-title>
            <img src="/dist/img/hero-light.png" />
            <ld-card-content>
                <p class="intro">
                    This is an introduction paragraph.<br/>
                    It gets printed in a larger font.
                </p>
                <p>
                    Normal text
                </p>
                <h3>Small hading</h3>
                <ul>
                    <li>list item 1</li>
                    <li>list item 2</li>
                </ul>
            </ld-card-content>
        </ld-card>


### `<ld-card-title>`

* Renders a card title
* Supports an optional `img` attribute for injecting a background image into the title node. 
* Supports a `dark` class for a card with a dark background (and white text).
* Example: see [`<ld-card>`](#ld-card) 

### `<ld-card-content>`

* Adds a padding around its direct child nodes.
* Example: see [`<ld-card>`](#ld-card) 

### `<ld-collapsible>`

* Turns its direct child nodes into one collapsible card.
* Requires a `title` attribute for specifying the card/toggle title 
* Supports a boolean `collapsed` attribute for setting the initial state to `collapsed`.
* Example:

        <ld-collapsible title="Collapsed section" collapsed>
            <p>some text</p>
        </ld-collapsible>

### `<ld-data-table>`

* Renders a data table with row count info, sorting options, page size selector, and pagination.
* Requires a `query` attribute with a pointer to a query template (see `src/queries/list-by-type.rq` for the format).
* Requires a `count-query` attribute with a pointer to a COUNT-query template (see `src/queries/list-by-type-count.rq` for the format).
* Requires a `search-fields` attribute for specifying which variables in the query templates should be used for filtering.
* Requires a `resource` attribute with a URI that will replace any placeholders in the query templates.
* Example for a data table that lists resources with a type of `antenne:Straling`:

        <ld-data-table
            endpoint="http://fuseki-zendantennes-on-1.vm.cumuli.be:3030/zendantennes/sparql"
            query="/queries/list-by-type.rq"
            count-query="/queries/list-by-type-count.rq"
            search-fields="?uri ?label"
            resource="https://data.zendantennes.omgeving.vlaanderen.be/ns/zendantenne#Straling"
        ></ld-data-table>
  
### `<ld-lookup-form>`

* Renders a linked data lookup form.
* Requires a `samples` attribute with a pointer to a samples text file (see `src/samples/imjv-lookup.txt` for the format).
* Example: 

        <ld-lookup-form samples="/samples/imjv-lookup.txt">
            Opzoeken op basis van identifier
        </ld-lookup-form>

### `<ld-map>`

* Renders a map if coordinates are provided.
* Supports either `x` and `y` (Lambert72) attributes, or `lon` and `lat` for WGS84-encoded coordinates of a marker.
    * When prefixed with a colon, the values get directly interpreted as numbers (the component will auto-convert string values to floats if needed, though). 
* Example: 

        <ld-map :x="147308.80" :y="214146.48"></ld-map>


### `<ld-object>`

* Represents a triple object.
* Can contain text or markup. For BNodes, add a `bnode` attribute and use nested `ld-predicate` nodes (see example below).
* Literal object example:

        <ld-object>xyz</ld-object>

* Resource object example:

        <ld-object><a href="...">xyz</a></ld-object>

* BNode object example (note the boolean `bnode` attribute):

        <ld-object bnode>
            <ld-predicate about="http://www.w3.org/1999/02/22-rdf-syntax-ns#first">
                <a class="label" href="http://www.w3.org/1999/02/22-rdf-syntax-ns#first">first</a>
                <ld-object>abc</ld-object>
            </ld-predicate>
            <ld-predicate about="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest">
                <a class="label" href="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest">rest</a>
                <ld-object>xyz</ld-object>
            </ld-predicate>
        </ld-object>

### `<ld-predicate>`

* Wraps a set of `ld-object` nodes.
* Requires a direct child node with a `label` class.
* Supports an `about` attribute for specifying the predicate's URI.
* Supports an `endpoint` attribute for dynamically loading objects.
* Supports an `inbound` attribute (together with `endpoint`) for dynamically loading inverse objects and rendering the widget accordingly.
* Supports a boolean `wide` attribute for a 100%-wide predicate (instead of the default 50%), e.g. for ontology pages.
* Auto-replaces objects with a taxonomy for selected SKOS predicates (see [`<ld-taxonomy>`](#ld-taxonomy)).
* Example:

        <ld-subject about="http://example.org/#resource">
            <ld-predicate about="http://purl.org/dc/terms/identifier">
                <a class="label" href="http://purl.org/dc/terms/identifier">identifier</a>
                <ld-object>abc</ld-object>
                <ld-object>xyz</ld-object>
            </ld-predicate>
            
            <ld-predicate about="..." endpoint="http...">
                ...
            </ld-predicate>

            <ld-predicate about="..." endpoint="http..." inbound>
                ...
            </ld-predicate>
            ...
        </ld-subject>

### `<ld-search-form>`

* Renders a keyword search form.
* Requires a `samples` attribute with a pointer to a samples text file (see `src/samples/imjv-search.txt` for the format).
* Requires an `endpoint` attribute with a pointer to the SPARQL API.
* Example: 

        <ld-search-form endpoint="https://id.milieuinfo.be/imjv/keywordsearch" samples="/samples/imjv-search.txt">
            Opzoeken met een sleutelwoord
        </ld-search-form>

### `<ld-sparql-form>`

* Renders a linked data SPARQL form.
* Requires a `samples` attribute with a pointer to a samples text file (see `src/samples/imjv-sparql.txt` for the format).
* Requires an `endpoint` attribute with a pointer to the SPARQL API.
* Example: 

        <ld-sparql-form endpoint="https://id.milieuinfo.be/imjv/sparql" samples="/samples/imjv-sparql.txt">
            Opzoeken met een SPARQL zoekopdracht
        </ld-sparql-form>

### `<ld-subject>`

* Wraps a set of `ld-predicate` nodes.
* Supports an `about` attribute for specifying a URI that deviates from the body tag's `about` attribute.
* Example:

        <ld-subject about="http://example.org/#resource">
            ...
        </ld-subject>

### `<ld-taxonomy>`

* Fetches and injects a SKOS-based tree-view.
* This is a sub-component that gets activated automatically by [`<ld-predicate>`](#ld-predicate) when
  * an `endpoint` property is set, and
  * the predicate is skos:(hasTopConcept|topConceptOf|inScheme|broader|narrower). 
 
### `<ld-view>`

* Injects a breadcrumbs navigation and a department header, and enables child components.
* Example:

        ...
        <body about="http://...">
            <div id="header">
                ...
            </div>
            <div id="content">
                <ld-view>
                    <h1>Departement Omgeving - Linked Data</h1>
                    <flex-container>
                        ...
                    </flex-container>
                </ld-view>
            </div>
            <!-- footer -->
            ...
            <!-- init-snippet -->
        </body>
