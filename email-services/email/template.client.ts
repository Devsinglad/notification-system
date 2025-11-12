import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
// client to communicate with the template service
export class TemplateClient {
  constructor(private readonly http: HttpService) {}

  async getTemplate(templateId: string) {
    //   use HttpService to call template service
    //   const template = await templateClient.getTemplate('welcome-email');
    const res = await lastValueFrom(
      this.http.get(`http://template-service:3003/templates/${templateId}`),
      );
    return res.data;
  }
}



// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TemplateClient {
//   async getTemplate(templateId: string) {
//     // Simulate fetching template from Template Service
//     const templates = {
//       welcome: {
//         subject: 'Welcome to MyApp!',
//         content: '<h1>Hello {{username}}</h1><p>Click here to verify: {{link}}</p>',
//       },
//     };
//     return templates[templateId];
//   }
// }
