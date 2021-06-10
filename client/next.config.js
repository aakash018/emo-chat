module.exports = {
    sassOptions: {
        includePaths: ['./'],
        prependData: `@import "sass/abstracts/variables.scss";
            @import "sass/abstracts/mixins.scss";`
    },
    images: {
        domains: ['images.unsplash.com', "lh3.googleusercontent.com"],
    }
}