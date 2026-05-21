import nodemailer from "nodemailer";
import { IEmailService, IEmailAttachment } from "../../application/interfaces/services/IEmailService";

export class EmailService implements IEmailService {
  private transporter!: nodemailer.Transporter;
  private isTestAccount = false;
  private testAccountUser = "";

  async initialize(): Promise<void> {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass
        }
      });
      this.isTestAccount = false;
    } else {
      console.log("SMTP credentials missing. Generating Ethereal test SMTP account...");
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        this.isTestAccount = true;
        this.testAccountUser = testAccount.user;
        console.log(`Ethereal test account created successfully. User: ${testAccount.user}`);
      } catch (err) {
        console.error("Failed to generate Ethereal test account", err);
        throw err;
      }
    }
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    text: string,
    attachment: IEmailAttachment
  ): Promise<{ success: boolean; previewUrl?: string }> {
    if (!this.transporter) {
      throw new Error("EmailService has not been initialized. Call initialize() first.");
    }

    const fromAddress = this.isTestAccount ? this.testAccountUser : (process.env.EMAIL_USER || "noreply@stocksmart.io");

    const info = await this.transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      attachments: [attachment]
    });

    if (this.isTestAccount) {
      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      return { success: true, previewUrl };
    }

    return { success: true };
  }
}
