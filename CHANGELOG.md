# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* \-

## [1.7.0] - 2019-06-20

### Changed

* `ld-data-table`: Link URLs from the same URI space as the table resource (or page subject as fallback)  get
  replaced with local paths  (only on left-click; it is still possible to copy or open the original URI via right-click).

### Added

* Added deployed query templates to repository.

### Fixed

* Submitting `ld-lookup-form`, `ld-search-form`, and `ld-sparql-form` works properly in Chrome and Safari now.

### Security 

* Audited vulnerable npm dependencies.

## [1.6.0] - 2019-06-04

### Changed

* `ld-object` and `ld-taxonomy`: Link URLs from the same URI space as the page subject get replaced with local paths
  (only on left-click; it is still possible to copy or open the original URI via right-click).

## [1.5.0] - 2019-04-22

### Added

* Page size selector in `ld-data-table`

### Changed

* Fine-tuned styles.
* Updated demo files.

## [1.4.0] - 2019-04-20

### Added

* CSS rules for query result tables.
* `ld-predicate`: Support for `wide` attribute.
* Query results sample view.
* Ontology sample view.

### Changed

* Updated demo files.

## [1.3.0] - 2019-04-20

### Fixed

* Subject does not always get detected.

### Added

* NPM script shortcut for running the app in dev and build mode.
* Removal of URI duplicates after retrieving query results.
* `ld-taxonomy` component (auto-invoked by `ld-predicate` when endpoint is set and predicate is from SKOS)
* `ld-collapsible` listens for content changes to sync its height faster.
* Taxonomy examples in resource sample page.

### Changed

* Query cache is now a singleton and works across all components. 
* Improved README.
* Update demo files.

## [1.2.0] - 2019-04-17

### Added

* Components
  * `ld-collapsible`
  * `ld-predicate`
     * Added support for `endpoint` property for dynamically loading objects
     * Added support for `inbound` property for dynamically loading inverse objects (i.e. subjects)

### Changed

* The demo has been updated.
* Predicate labels use the lighter green background color again.

## [1.1.0] - 2019-04-11

### Added

* Export options styling
* Horizontal lines styling (`hr` tag)
* Allow gutter-disabling in flex components (via `no-gutter`)
* Components
  * `ld-map`
  * `ld-subject`
  * `ld-predicate`
  * `ld-object`
* Sample resource
* Resource demo
* Polyfill for `closest(selector)`

### Changed

* Polyfill inclusion in `init.html` partial.
* Link font weight (now stronger).

## [1.0.0] - 2019-04-04

### Added

* Dev server
* Demo and samples
* Components
  * `department-header`
  * `flex-container`
  * `flex-item`
  * `ld-accordion`
  * `ld-card`
  * `ld-card-content`
  * `ld-card-title`
  * `ld-data-table`
  * `ld-lookup-form`
  * `ld-search-form`
  * `ld-sparql-form`
  * `ld-view`
* Readme