export default {
    props: {
        'dsk': String | Number,
        'tab': String | Number,
        'mob': String | Number,
        'noGutter': Boolean
    },
    data() {
        return {
        }
    },
    computed: {
        flexClass() {
            const dsk = parseInt(this.dsk) || 100;
            const tab = parseInt(this.tab) || dsk;
            const mob = parseInt(this.mob) || tab;
            const noGutter = this.noGutter ? 'no-gutter' : '';
            return `dsk-${dsk} tab-${tab} mob-${mob} ${noGutter}`;
        }
    }
}
