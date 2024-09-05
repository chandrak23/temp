// blog.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('upload')
  async uploadBlog(@Req() req: Request, @Res() res: Response, @Headers() headers: Headers) {
    const file = req.body.file;
    const externalHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY',
    };
    const response = await this.blogService.uploadBlog(file, externalHeaders);
    return res.json(response);
  }
}



// blog.service.ts
import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class BlogService {
  constructor(private readonly httpService: HttpService) {}

  async uploadBlog(file: any, externalHeaders: any) {
    const url = 'https://example.com/api/endpoint'; // Replace with your external API URL
    const data = {
      file: file,
    };
    const config = {
      headers: externalHeaders,
    };
    const response = await this.httpService.put(url, data, config);
    return response.data;
  }
}



// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';

@Module({
  imports: [],
  controllers: [AppController, BlogController],
  providers: [AppService, BlogService],
})
export class AppModule {}




