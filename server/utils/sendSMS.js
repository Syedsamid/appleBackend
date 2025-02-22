import twilio from "twilio";
import config from "config";

const accountSid = config.get("SID");
const authToken = config.get("TOKEN");
const phone = config.get("PHONE");
const client = new twilio(accountSid,authToken);

async function sendSMS(smsData){
    try {
        await client.messages.create({
            body: smsData.body,
            to: smsData.to,
            from:phone,
        })
        console.log("SMS Sent");
    } catch (error) {
        console.log(error);
    }
}

export default sendSMS