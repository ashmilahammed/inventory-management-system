export interface IEmailAttachment {
  filename: string;
  content: Buffer;
}

export interface IEmailService {
  initialize(): Promise<void>;
  sendEmailWithAttachment(
    to: string,
    subject: string,
    text: string,
    attachment: IEmailAttachment
  ): Promise<{ success: boolean; previewUrl?: string }>;
}
