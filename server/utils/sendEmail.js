import nodemailer from "nodemailer";
import config from "config";

const userEmail = config.get("Email");
const userAppPassword = config.get("PASS");

async function sendMail(emailData){
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: userEmail,
                pass: userAppPassword,
            }
        });

        let info = await transporter.sendMail({
            from: `"Suhail Roushan"<${userEmail}>`,
            subject: emailData.subject,
            to: emailData.to,
            html: emailData.html,
            text:emailData.text,
        });
        console.log("Email SEnt", info.messageId);
    } catch (error) {
        console.log(error);
    }
}
export default sendMail;
