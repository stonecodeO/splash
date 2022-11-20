import mongoose, { Document, Schema } from 'mongoose';
export interface comment {
    value: string;
    post: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
}

export interface commentModel extends comment, Document {}

const CommentSchema: Schema = new Schema(
    {
        value: { type: String, required: true },
        post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
        author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        comment: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model<commentModel>('comment', CommentSchema);
