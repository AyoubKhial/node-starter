const { sendMail } = require('services/mailer');

describe('Mailer service', () => {
    it('Should check that next get called with old cached result.', async () => {
        const options = {
            email: 'test@mail.com',
            subject: 'Reset password.',
            message: 'reset password mail body'
        };
        const config = {
            mail: {
                fromName: 'Movify',
                fromEmail: 'noreply@movify.com'
            }
        };
        const service = {
            createTransport() { return this },
            sendMail: message => message
        }
        const response = await sendMail({ options, config, service });
        expect(response).toEqual({
            from: 'Movify <noreply@movify.com>',
            to: 'test@mail.com',
            subject: 'Reset password.',
            text: 'reset password mail body'
        });
    });
});
