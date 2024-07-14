const {Schema, model} = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormatting = require('../utils/dateFormat');

const thoughtSChema = new Schema(
    {
        thoughtText: {
            type: String,
            required: 'Please leave a thought',
            minlength: 1,
            maxlength: 300,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormatting(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

thoughtSChema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSChema);

module.exports= Thought;