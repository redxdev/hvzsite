module.exports = {

    attributes: {
        title: {
            type: 'string'
        },

        summary: {
            type: 'text'
        },

        body: {
            type: 'text'
        },

        postDate: {
            type: 'datetime',
            defaultsTo: function () {
                return new Date();
            }
        },

        important: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};
