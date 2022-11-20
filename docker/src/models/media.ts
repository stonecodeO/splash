import mongoose, {Document, Schema} from "mongoose";
export interface IMedia {
    name: String,
    image: {data: Buffer, ContentType: String}
}

export interface IMediaModel extends IMedia, Document {}

const MediaSchema: Schema = new Schema(
    {
        name: String,
        image: {data: Buffer, ContentType: String },        
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IMediaModel>('Media', MediaSchema);