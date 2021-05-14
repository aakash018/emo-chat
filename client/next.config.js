module.exports = (phase, { defaultConfig }) => {
    if ('sassOptions' in defaultConfig) {
        defaultConfig['sassOptions'] = {
            includePaths: ['./'],
            prependData: `@import "sass/abstracts/variables.scss";
            @import "sass/abstracts/mixins.scss";                                      `,
        }
    }
    return defaultConfig;
}