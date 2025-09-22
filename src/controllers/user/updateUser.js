import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { config } from '../../config/config.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const updateUser = async (req, res) => {
  try {
    const fieldObj = req.body;
    const fieldName = Object.keys(fieldObj)[0];

    const userColl = createCollection(config.db.collections.users);
    const token = getFormattedToken(req.headers.authorization);
    const payload = jwt.verify(token, config.jwt.secret);
    const id = new ObjectId(payload.id);

    await userColl.findOneAndUpdate({ _id: id }, { $set: fieldObj });
    res.status(201).json({ success: true, messageKey: `field.update`, messageParams: { field: fieldName }, data: null });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, messageKey: 'field.not_update', data: null });
  }
};
