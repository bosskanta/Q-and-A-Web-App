import * as mongooseDef from 'mongoose'

let mongoose = mongooseDef.default;

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
})

let Tag = mongoose.model('Tag', tagSchema, 'tags');
export default Tag;