import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { config } from '../../config/config.js';
import jwt from 'jsonwebtoken';
import { getFormattedToken } from '../../utils/getToken.js';

export const getUser = async (req, res) => {
  try {
    const token = getFormattedToken(req.headers.authorization);

    const payload = jwt.verify(token, config.jwt.secret);

    const usersColl = createCollection(config.db.collections.users);
    const id = new ObjectId(payload.id);
    const user = await usersColl.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ success: false, messageKey: 'user.not_found' });
    }

    res.status(200).json({
      success: true,
      messageKey: 'users.found',
      data: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, messageKey: 'users.not_found' });
  }
};
