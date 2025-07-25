import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

// Create a Sendinblue TransactionalEmailsApi instance
const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendMail(to, subject, text, html) {
  const sendSmtpEmail = {
    sender: JSON.parse(process.env.EMAIL_FROM),
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  };

  return tranEmailApi.sendTransacEmail(sendSmtpEmail);
}
