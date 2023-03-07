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
    local advvrgstuk=${1}
    curl -G "https://data.dsi-ontwikkel.omgeving.vlaanderen.be/sparql?"\
        -H "Accept: application/json"\
        --data-urlencode 'query=prefix owl:   <http://www.w3.org/2002/07/owl#> prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix dossier: <https://data.vlaanderen.be/ns/dossier#> prefix skos:  <http://www.w3.org/2004/02/skos/core#> prefix dcterms: <http://purl.org/dc/terms/> prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> prefix dsi:   <https://data.dsi.omgeving.vlaanderen.be/ns/dsi#> prefix ns2:   <http://purl.org/pav/> prefix prov:  <http://www.w3.org/ns/prov#> prefix foaf:  <http://xmlns.com/foaf/0.1/> prefix dcat:  <http://www.w3.org/ns/dcat#> SELECT DISTINCT ?advvrgstuk ?advvrgstuk_downloadlink ?stuk ?stuk_downloadlink WHERE {  ?advvrgstuk a dossier:Stuk.  OPTIONAL { ?advvrgstuk dossier:isVoorgesteldDoor/dcat:downloadURL ?advvrgstuk_downloadlink}.  OPTIONAL { ?advvrgstuk dcterms:relation ?stuk.  OPTIONAL {?stuk dossier:isVoorgesteldDoor/dcat:downloadURL ?stuk_downloadlink}. }.  BIND( IRI("'${advvrgstuk}'") as ?mijn_stuk)  FILTER (?advvrgstuk = ?mijn_stuk). }'\
        --compressed\
        -H 'Connection: keep-alive'\
        --output '/tmp/downloadurls.json'	    
}

function iterate {
    local  myarray=`jq -r '.results .bindings[]' '/tmp/downloadurls.json' `
    local row
    local advvrgstuk=`echo "${myarray}" | jq -r '.advvrgstuk .value' | sort -u | sed -e  's;https://data.dsi.omgeving.vlaanderen.be/id/stuk/;;g' | tr '/' '_'`
    local advvrgstuk_downloadlink=`echo "${myarray}" | jq -r '.advvrgstuk_downloadlink .value' | sort -u `
    echo download ${advvrgstuk[0]} "advvrgstuk" ${advvrgstuk_downloadlink[0]}  
    download ${advvrgstuk[0]} "advvrgstuk" ${advvrgstuk_downloadlink[0]}
    for row in $(echo "${myarray}" | jq -r '. | @base64'); do
        local stuk_downloadlink=`echo $(_jq '.stuk_downloadlink.value' ${row})` 
        local advvrgstuk=`echo $(_jq '.advvrgstuk.value' ${row}) | sed -e  's;https://data.dsi.omgeving.vlaanderen.be/id/stuk/;;' | tr '/' '_'`
        local stuk=`echo $(_jq '.stuk.value' ${row})`  
        echo $stuk 
        download ${advvrgstuk} "stukken" ${stuk_downloadlink} 
    done  
}

if [ -z "$1" ]; then 
    echo "Usage:"
    echo "bash download_alle_stukken_gelinkt_aan_een_adviesvraag.sh  https://data.dsi.omgeving.vlaanderen.be/id/stuk/RUP_34002_214_00040_00001.PV.3.Workflow.ADVVRG.1"
    exit 0
else
    advvrgstuk=${1}
    query ${advvrgstuk}
    iterate
fi
