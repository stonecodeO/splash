import mongoose, {Document, Schema} from 'mongoose';

export interface IProfile {
   gender?: string,
   birthday?: Date,
   friends?: [Schema.Types.ObjectId]
}

export interface IProfileModel extends IProfile, Document {}

const ProfileSchema: Schema = new Schema(
    {
        gender: String,
        birthday: Schema.Types.Date,
        friends: [{type: Schema.Types.ObjectId, ref:"Profile"}]    
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IProfileModel>('Profile', ProfileSchema);