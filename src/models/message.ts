import mongoose, { Schema, Document} from 'mongoose';

export interface IMessage{
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    content: String,
    read: Boolean
}
export interface IMessageModel extends IMessage, Document {}
const MessageSchema: Schema = new Schema({ 
    from :{type: Schema.Types.ObjectId, required: true, ref: 'User'},
    to :{type: Schema.Types.ObjectId, required: true, ref: 'User'},
    content: { type: String, required: true},
    read: { type: Boolean, default: false}
}, 
{
    timestamps: true
})

export default mongoose.model<IMessageModel>('Message', MessageSchema);

