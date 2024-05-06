import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packagejson = require('../package.json');

@Injectable()
export class AppService {
  getVersion(): string {
    return packagejson.version;
  }
}
