import { createCollection } from '../../client/collections.js';
import { config } from '../../config/config.js';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usersColl = createCollection(config.db.collections.users);
    const existUser = await usersColl.findOne({ email: email });

    if (!existUser) {
      logger.warn('Forgot password attempt with non-existing email', { email });
      return res.status(404).json({ success: false, messageKey: 'auth.email_not_found', data: null });
    }

    const temporaryToken = jwt.sign({ id: existUser._id.toString() }, config.jwt.secret, { expiresIn: '10m' });
    const resend = new Resend(config.resend.apiKey);
    const link = `http://${config.client_url}/en/reset-password?token=${temporaryToken}`;

    await resend.emails.send({
      from: 'Dev Tracker <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Password',
      html: `
      <strong>Reset password</strong>
      <a href="${link}">Click here</a>
    `,
    });

    logger.info('Password reset email sent', { email, tokenExpiresIn: '10m' });
    res.status(200).json({ success: true, messageKey: 'auth.send_link_success', data: null });
  } catch (error) {
    logger.error('Internal server error', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: 'auth.send_link_error' });
  }
};
