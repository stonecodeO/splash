import { json, NextFunction, Request, Response } from 'express';
import Profile from '../models/profile';
import User from '../models/user';
import Media from '../models/media';
import profileService from '../services/profile';

const readprofile = (req: Request, res: Response) => {
    const profileId = req.params.profileId;

    return Profile.findById(profileId)
        .then((profile) => res.status(200).json({ profile }))
        .catch((error) => res.status(500).json({ error }));
};
const readAllprofiles = async (req: Request, res: Response) => {
    try {
        const profiles = await profileService.findAllProfile();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json(error);
    }
};
const updateProfile = async (req: Request, res: Response) => {
    const profileId = req.params.profileId;
    // make sure current user is unique
    const refreshToken = req.cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });
    const ownerProfileUser = await User.findOne({ profile: profileId });
    if (!foundUser) return res.status(404).json({ message: 'profile not found' });
    if (ownerProfileUser && JSON.stringify(foundUser) !== JSON.stringify(ownerProfileUser)) return res.status(403).json({ message: 'this is private' });

    try {
        const updateProfile = await Profile.findOneAndUpdate({ _id: profileId }, req.body, { new: true, rawResult: true });
        if (updateProfile.value == null) res.status(404).json({ message: 'Profile not found' });
        res.status(200).json({ success: 'profile updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};
const deleteprofile = (req: Request, res: Response, next: NextFunction) => {
    const profileId = req.params.profileId;

    return Profile.findByIdAndDelete(profileId).then((profile) =>
        profile
            ? res.status(201).json({
                  message: 'Deleted !'
              })
            : res.status(404).json({ message: 'not found!' })
    );
};
const uploadFiles = (req: Request, res: Response) => {
    Media.create({
        name: req?.body.name,
        image: {
            //@ts-ignore
            data: fs.readFileSync(path.resolve('./src/uploads/' + req.name)),
            ContentType: req.file?.mimetype
        }
    })
        .then((media) => console.log(media))
        .catch((err) => console.error(err));
    res.status(200).json({ success: 'image save successfully!' });
};

export default { readprofile, readAllprofiles, updateProfile, deleteprofile, uploadFiles };
