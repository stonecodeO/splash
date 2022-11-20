import Profile from '../models/profile';

const createProfile = (payload: { gender?: string; birthday?: Date }) => {
    return Profile.create(payload);
};

const findAllProfile = () => {
    return Profile.find().select(['-_id', '-__v', '-createdAt', '-updatedAt']);
};

export default {
    createProfile,
    findAllProfile
};
