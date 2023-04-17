<template>
  <div class="ld-sparql-form">
    <h4 class="pane-toggle">
      <slot></slot>
    </h4>
    <form class="pane" method="GET" @submit.prevent="onSubmit" @reset="onSparqlReset">
      <div id="query-field" class="fields">
      </div>
      <div class="buttons">
        <flex-container>
          <flex-item dsk="66" mob="100">
            <button class="yasqe_share" type="button" id="sparql-fullscreen-button" @click="fullscreen">
              <div class="svgImg">
                <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-maximize" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <polyline points="16 4 20 4 20 8" /> <line x1="14" y1="10" x2="20" y2="4" /> <polyline points="8 20 4 20 4 16" /> <line x1="4" y1="20" x2="10" y2="14" /> <polyline points="16 20 20 20 20 16" /> <line x1="14" y1="14" x2="20" y2="20" /> <polyline points="8 4 4 4 4 8" /> <line x1="4" y1="4" x2="10" y2="10" /> </svg>
                <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-minimize" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <polyline points="5 9 9 9 9 5" /> <line x1="3" y1="3" x2="9" y2="9" /> <polyline points="5 15 9 15 9 19" /> <line x1="3" y1="21" x2="9" y2="15" /> <polyline points="19 9 15 9 15 5" /> <line x1="15" y1="9" x2="21" y2="3" /> <polyline points="19 15 15 15 15 19" /> <line x1="15" y1="15" x2="21" y2="21" /> </svg>              </div>
            </button>
            <button type="submit" id="sparql-submit-button">Zoekopdracht uitvoeren</button>
            <button type="reset" id="sparql-reset-button">Herladen</button>
            <span class="status pulsing" v-if="loading">Even geduld ...</span>
          </flex-item>
          <flex-item dsk="33" mob="100">
            <select class="samples" size="1" v-model="selectedSample">
              <option value="">Voorbeelden ...</option>
              <option v-for="option in sampleOptions" :value="option.value" :title="option.value">
                {{ option.label }}
              </option>
            </select>
          </flex-item>
        </flex-container>
      </div>
    </form>
  </div>
</template>

<script>
import AccordionPaneMixin from '../js/accordion-pane-mixin';
import ApiFormMixin from '../js/api-form-mixin';
import '@triply/yasgui/build/yasgui.min.css'
import Yasqe from '@triply/yasqe'

export default {
  mixins: [AccordionPaneMixin, ApiFormMixin],
  data() {
    return {
      name: 'sparqlForm',
      yasqe: null,
      isFullscreen: false,
    }
  },

  watch: {
    inputValue(value) {
      if (!this.yasqe) {
        return;
      }

      if (value) {
        this.yasqe.setValue(value);
      } else {
        this.resetYasqe();
      }
    }
  },

  mounted() {
    this.initFromHash();
    this.initYasqe();
  },

  methods: {
    initFromHash() {
      const matches = location.hash ? location.hash.match(/^.*&query=([^&]+).*/) : null;
      if (matches) {
        this.inputValue = decodeURIComponent(matches[1].replace(/\+/g, ' '));
      }
    },
    initYasqe() {
      if (this.yasqe) {
        return; // already initialized
      }

      this.yasqe = new Yasqe(
          this.$el.querySelector('#query-field'),
          {
            showQueryButton: false,
            resizeable: false,
            pluginButtons: () => this.$el.querySelector('#sparql-fullscreen-button'),
            requestConfig: {
              endpoint: location.protocol + '//' + location.host + this.endpoint
            },
            createShareableLink: (element) => {
              let query = element.getValue();
              return location.protocol + '//' + location.host + this.endpoint + '?query='
                  + encodeURIComponent(query);
            }
          }
      );
      this.resetYasqe();
    },

    resetYasqe() {
      this.yasqe.setValue('# Voer een SPARQL zoekopdracht in ...');
    },

    parseSamples(response) {
      this.sampleOptions = response.body
      .split(/(^|[\r\n]+)##/)
      .filter((chunk) => {
        return !chunk.match(/^[\r\n\s]*$/)
            && !chunk.match(/^#/)
            ;
      })
      .map((chunk) => {
        const parts = chunk.trim().match(/^([^\r\n]+)[\r\n]+([\s\S]+)$/) || ['', '', ''];// `LABEL\r\nQUERY`
        return {
          value: '# ' + parts[1] + "\n" + parts[2],
          label: parts[1]
        };
      })
      ;
    },

    onSparqlReset(e) {
      if(e.submitter && e.submitter.id === 'sparql-reset-button') {
        this.onReset();
        this.resetYasqe();
      }
    },

    onSubmit(e) {
      if(e.submitter && e.submitter.id === 'sparql-submit-button') {
        let query = this.yasqe ? this.yasqe.getValue() : this.inputValue;
        if (query) {
          this.loading = true;
          location.hash = this.name + '&query=' + encodeURIComponent(query);// allow re-init when user hits BACK button
          location.href = this.endpoint + '?query=' + encodeURIComponent(query);
        }
      }
    },

    fullscreen(e) {
      let queryField = this.$el.querySelector('#query-field');
      let yasqe = queryField.querySelector('.yasqe');
      let codemirror = queryField.querySelector('.CodeMirror');
      if (this.isFullscreen) {
        queryField.style.height = this.previous.height;
        queryField.style.width = this.previous.width;
        queryField.style.left = this.previous.left;
        queryField.style.top = this.previous.top;
        queryField.style.position = this.previous.position;
        yasqe.style.height = this.previous.yasqe.height;
        yasqe.style.width = this.previous.yasqe.width;
        codemirror.style.height = this.previous.codemirror.height;
        this.isFullscreen = false;
      } else {
        this.previous = {
          height: queryField.style.height,
          width: queryField.style.width,
          top: queryField.style.top,
          left: queryField.style.left,
          position: queryField.style.position,
          yasqe: {
            height: yasqe.style.height,
            width: yasqe.style.width,
          },
          codemirror: {
            height: codemirror.style.height
          }
        };

        queryField.style.height = "100%";
        queryField.style.width = "100%";
        queryField.style.left = 0;
        queryField.style.top = 0;
        queryField.style.position = "fixed";
        yasqe.style.height = "100%";
        yasqe.style.width = "100%";
        codemirror.style.height = "100%";
        this.isFullscreen = true;
      }
    }
  }
}
</script>

<style lang="scss">
@import "../css/_variables";

.ld-sparql-form {

  .buttons {
    padding-top: 8px !important;
    padding-bottom: 4px !important;
  }

  .CodeMirror-fullscreen {
    bottom: 110px;
  }

  .CodeMirror-code * {
    font-size: 14px;
    line-height: 1.5em;
  }
}
</style>
