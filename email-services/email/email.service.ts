import { Injectable } from '@nestjs/common';
import { TemplateClient } from './template.client';
import { RetryService } from './retry.service';
import axios from 'axios';

@Injectable()
export class EmailService {
  private serviceId = process.env.EMAILJS_SERVICE_ID;
  private templateId = process.env.EMAILJS_TEMPLATE_ID;
  private publicKey = process.env.EMAILJS_PUBLIC_KEY;

  constructor(
    private readonly templateClient: TemplateClient,
    private readonly retryService: RetryService,
  ) {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      throw new Error('EmailJS credentials are not set in .env');
    }
  }

  async processEmail(message: any) {
    const { to, templateId, variables, attempt = 0 } = message;

    try {
      // 1️⃣ Fetch your template
      const template = await this.templateClient.getTemplate(templateId);

      // 2️⃣ Render template variables
      const html = this.renderTemplate(template.content, variables);

      // 3️⃣ Send email via EmailJS REST API
      const payload = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        template_params: {
          to_email: to,
          subject: template.subject,
          message: html,
          from_email: 'williamseneojo@gmail.com',
        },
      };

      await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload);

      console.log(`✅ Email sent successfully to ${to}`);
    } catch (error: any) {
      console.error(`⚠️ Email failed (Attempt ${attempt}): ${error.message}`);
      await this.retryService.handleRetry(message, 'email.queue', attempt);
    }
  }

  private renderTemplate(content: string, vars: Record<string, any>): string {
    return content.replace(
      /\{\{(.*?)\}\}/g,
      (_, key) => vars[key.trim()] || '',
    );
  }
}

// import { Injectable } from '@nestjs/common';
// import SendGrid from '@sendgrid/mail';
// import { TemplateClient } from './template.client';
// import { RetryService } from './retry.service';

// @Injectable()
// export class EmailService {
//   constructor(
//     private readonly templateClient: TemplateClient,
//     private readonly retryService: RetryService,
//   ) {
//     const apiKey = process.env.SENDGRID_API_KEY;
//     if (!apiKey) throw new Error('SENDGRID_API_KEY is not defined!');

//     SendGrid.setApiKey(apiKey);
//   }

//   async processEmail(message: any) {
//     const { to, templateId, variables, attempt = 0 } = message;
//     try {
//       // 1️⃣ Get your template (HTML file or DB content)
//       const template = await this.templateClient.getTemplate(templateId);

//       // 2️⃣ Replace variables (like {{name}}, {{link}}) in your HTML
//       const html = this.renderTemplate(template.content, variables);

//       // 3️⃣ Send it through SendGrid (HTML only, no templateId)
//       await SendGrid.send({
//         to,
//         from: 'williamseneojo@gmail.com', // verified sender
//         subject: template.subject,
//         html, // 👈 your rendered HTML
//       });

//       console.log(`✅ Email sent successfully to ${to}`);
//     } catch (error: any) {
//       console.error(`⚠️ Email failed (Attempt ${attempt}): ${error.message}`);
//       await this.retryService.handleRetry(message, 'email.queue', attempt);
//     }
//   }

//   private renderTemplate(content: string, vars: Record<string, any>): string {
//     return content.replace(
//       /\{\{(.*?)\}\}/g,
//       (_, key) => vars[key.trim()] || '',
//     );
//   }
// }
