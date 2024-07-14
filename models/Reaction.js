const { Schema, Types } = require('mongoose');
const dateFormatting = require('../utils/dateFormat');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: ()=> new Types.ObjectId(),

        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 300
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timestamp => dateFormatting(timestamp),
        }
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

module.exports= reactionSchema;