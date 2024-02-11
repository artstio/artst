import { json } from "@remix-run/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailBody {
  sender: {
    name: string;
    email: string;
  };
  to: {
    name?: string;
    email: string;
  }[];
  subject: string;
  htmlContent: string;
}

export const sendEmail = async (body: SendEmailBody) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${body.sender.name} <${body.sender.email}>`,
      to: body.to.map((to) => to.email),
      subject: body.subject,
      html: body.htmlContent,
    });

    if (error) {
      return json({ error }, 400);
    }
    return json(data, 200);
  } catch (err: unknown) {
    console.log(err);
    return false;
  }
};
