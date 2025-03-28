import { IsOptional, IsString } from 'class-validator';
import { createHash } from 'crypto';

export class AccessBrowser {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  major?: string;
}

export class AccessCPU {
  @IsString()
  @IsOptional()
  architecture?: string;
}

export class AccessDevice {
  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  type?: string;
}

export class AccessEngine {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  version?: string;
}

export class IAccessUserAgent {
  ua?: string;
  browser?: AccessBrowser;
  engine?: AccessEngine;
  os?: AccessEngine;
  device?: AccessDevice;
  cpu?: AccessCPU;
}
export interface IAccessDevice {
  ua?: string;
  browser?: string;
  engine?: string;
  os?: string;
  device?: string;
  cpu?: string;
  // Additional
  deviceHash?: string;

  userAccessId: number;
}

export class AccessUserAgent {
  @IsString()
  @IsOptional()
  ua?: string;

  @IsOptional()
  browser?: AccessBrowser;

  @IsOptional()
  engine?: AccessEngine;

  @IsOptional()
  os?: AccessEngine;

  @IsOptional()
  device?: AccessDevice;

  @IsOptional()
  cpu?: AccessCPU;

  getFormatedUserAgent?(userAccessId: number): IAccessDevice {
    const { ua, browser, cpu, device, engine, os } = this;
    const result: IAccessDevice = {
      browser: '',
      cpu: '',
      device: '',
      engine: '',
      os: '',
      ua: '',
      userAccessId,
    };
    let tArray = [];
    if (ua) {
      result.ua = ua;
    }
    if (browser) {
      if (browser.name) {
        tArray.push(browser.name);
      }
      if (browser.version) {
        tArray.push(`Version: ${browser.version}`);
      }
      if (browser.major) {
        tArray.push(`Major: ${browser.major}`);
      }
      result.browser = tArray.toString();
      tArray = [];
    }
    if (cpu && cpu.architecture) {
      result.cpu = `Arch.: ${cpu.architecture}`;
    }
    if (device) {
      if (device.vendor) {
        tArray.push(`Vendor: ${device.vendor}`);
      }
      if (device.type) {
        tArray.push(`Type: ${device.type}`);
      }
      if (device.model) {
        tArray.push(`Model: ${device.model}`);
      }
      result.device = tArray.toString();
      tArray = [];
    }
    if (os) {
      if (os.name) {
        tArray.push(os.name);
      }
      if (os.version) {
        tArray.push(`Version: ${os.version}`);
      }
      result.os = tArray.toString();
      tArray = [];
    }
    if (engine) {
      if (engine.name) {
        tArray.push(engine.name);
      }
      if (engine.version) {
        tArray.push(`Version: ${engine.version}`);
      }
      result.engine = tArray.toString();
      tArray = [];
    }
    const deviceHash = createHash('sha256').update(JSON.stringify(result)).digest('base64');
    return { ...result, deviceHash };
  }
  constructor(data: Partial<AccessUserAgent>) {
    Object.assign(this, removeEmpty(data));
  }
}
function removeEmpty(data) {
  //transform properties into key-values pairs and filter all the empty-values
  const entries = Object.entries(data).filter(([, value]) => value != null);

  //map through all the remaining properties and check if the value is an object.
  //if value is object, use recursion to remove empty properties
  const clean = entries.map(([key, v]) => {
    const value = typeof v == 'object' ? removeEmpty(v) : v;
    return [key, value];
  });

  //transform the key-value pairs back to an object.
  return Object.fromEntries(clean);
}
