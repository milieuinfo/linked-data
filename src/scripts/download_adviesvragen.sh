#!/bin/bash

function _jq {
    echo ${2} | base64 --decode | jq -r ${1}
}

function download {
    mkdir -p /tmp/${1}/${2}
    pushd /tmp/${1}/${2}
    echo curl ${3} -L -O
    #echo curl ${3} -b "${4}" -L --output ${5}
    curl ${3} -S -f -L -O
    popd
}

function query {
    curl -G "https://data.dsi-ontwikkel.omgeving.vlaanderen.be/sparql?"\
        -H "Accept: application/json"\
        --data-urlencode 'query=PREFIX dcat: <http://www.w3.org/ns/dcat#> prefix owl: <http://www.w3.org/2002/07/owl#> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix dossier: <https://data.vlaanderen.be/ns/dossier#> prefix skos: <http://www.w3.org/2004/02/skos/core#> prefix dcterms: <http://purl.org/dc/terms/> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> prefix dsi: <https://data.dsi.omgeving.vlaanderen.be/ns/dsi#> prefix ns2: <http://purl.org/pav/> prefix prov: <http://www.w3.org/ns/prov#> prefix foaf: <http://xmlns.com/foaf/0.1/> prefix dcat: <https://www.w3.org/ns/dcat#> SELECT DISTINCT ?dossier ?dossier_lb ?fichelink ?procedurestap ?adviesvraag ?ADVVRG ?startdatum ?einddatum ?adviesverlener ?adviesverlener_cd WHERE { ?adviesvraag dcterms:type <https://data.dsi.omgeving.vlaanderen.be/id/concept/activiteit/advvrg> . ?adviesvraag prov:wasAssociatedWith ?ag . ?ag rdfs:label ?adviesverlener. ?ag skos:notation ?adviesverlener_cd . ?adviesvraag dossier:vindtPlaatsTijdens ?procedurestap . ?procedurestap rdfs:label ?procedurestap_lb . ?procedurestap a dossier:Procedurestap . ?procedurestap dcterms:hasPart ?uow . ?uow dsi:begindatum ?startdatum . ?uow dsi:einddatum ?einddatum . ?zaak dossier:doorloopt ?procedurestap . ?dossier dossier:isNeerslagVan ?zaak . ?dossier foaf:homepage ?fichelink . ?dossier rdfs:label ?dossier_lb . ?adviesvraag prov:generated/dossier:isVoorgesteldDoor/<http://www.w3.org/ns/dcat#downloadURL> ?ADVVRG . FILTER (?einddatum >= NOW()).   BIND( IRI(CONCAT("https://data.dsi.omgeving.vlaanderen.be/id/dossier/", "'$1'")) as ?mijn_dossier)   FILTER(?dossier = ?mijn_dossier) } ORDER BY DESC(?einddatum) ?procedurestap ?adviesverlener'\
        --compressed\
        -H 'Connection: keep-alive'\
        --output '/tmp/downloadurls.json'	    
}

function iterate {
    local  myarray=`jq -r '.results .bindings[]' '/tmp/downloadurls.json' `
    local row
    for row in $(echo "${myarray}" | jq -r '. | @base64'); do
        local dossier=`echo $(_jq '.dossier.value' ${row}) | sed -e  's;https://data.dsi.omgeving.vlaanderen.be/id/dossier/;;' | tr '/' '_'`
        local adviesverlener=`echo $(_jq '.adviesverlener.value' ${row})  |  tr ' ' '_'  |  tr '[A-Z]' '[a-z]'`
        local downloadurl=`echo $(_jq '.ADVVRG.value' ${row})`    
        echo $st_label 
        download ${dossier} ${adviesverlener} ${downloadurl} 
    done  
}
dossiernummer=${1}
query ${dossiernummer}
iterate