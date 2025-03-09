const {Schema, model} = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'Users';
const DOCUMENT_NAME = 'User';
// Declare the Schema of the Mongo model
var userSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150,
    },
    email:{
        type:String,
        trim: true,
        unique:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    password:{
        type:String,
        required:true,
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false,
    },
    roles:{
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);