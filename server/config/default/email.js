import 'dotenv/config';

export default {
    nodemailer: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'deepak.mishra7674@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'newdeepak@7674'
        }
    },
    system: {
        fromAddress: {
            name: 'DPauls Travel & Tours Ltd',
            address: 'deepak.mishra7674@gmail.com'
        },
        toAddress: {
            name: 'DPauls Travel & Tours Ltd',
            address: 'deepak.mishra7674@gmail.com'
        }
    }
}