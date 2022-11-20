import mongoose, {Document, Schema} from "mongoose";
export interface IPost {
    title: String,
    description: String,
    author: Schema.Types.ObjectId,
    medias?: Schema.Types.DocumentArray,
}

export interface IPostModel extends IPost, Document {}

const UserSchema: Schema = new Schema(
    {
        title: {type: String, required: true },
        description: {type: String, required: true },
        author: {type: Schema.Types.ObjectId, required: true, ref: 'User'}, 
        medias: [{type: Schema.Types.ObjectId, required: false, ref: 'images', default: []}] 
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IPostModel>('Post', UserSchema);