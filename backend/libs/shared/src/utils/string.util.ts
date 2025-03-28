import { DefaultGenerationOptions, generateApiKey } from 'generate-api-key';
import * as pluralize from 'pluralize';
import { ObjectUtil } from './object.util';

export class StringUtil {
  // convert any case
  static convertCase = (str, toCase: 'snake' | 'pascal' | 'title' | 'kebab' | 'sentence' | 'camel' = 'camel') => {
    if (!str) return undefined;

    const delimiter = toCase === 'snake' ? '_' : toCase === 'kebab' ? '-' : ['title', 'sentence'].includes(toCase) ? ' ' : '';

    const transform = ['camel', 'pascal'].includes(toCase)
      ? (x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()
      : ['snake', 'kebab'].includes(toCase)
        ? (x) => x.toLowerCase()
        : toCase === 'title'
          ? (x) => x.slice(0, 1).toUpperCase() + x.slice(1)
          : (x) => x;

    const finalTransform =
      toCase === 'camel' ? (x) => x.slice(0, 1).toLowerCase() + x.slice(1) : toCase === 'sentence' ? (x) => x.slice(0, 1).toUpperCase() + x.slice(1) : (x) => x;

    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);

    return finalTransform(words.map(transform).join(delimiter));
  };
  static toTitleCase = (text: string, divider = ' '): string => {
    return text
      ?.trim()
      ?.replace(/([a-z0-9])([A-Z])/g, `$1${divider}$2`) // Convert "aB" to "a-b"
      ?.replace(/([A-Z])([A-Z][a-z])/g, `$1${divider}$2`) // Convert "ABCDef" to "ABC-Def"
      ?.toLowerCase()
      ?.split(' ')
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(' ');
  };
  static parseInteger(value: string, defaultVal: number, radix = 10): number {
    if (value === undefined || value === null) {
      return defaultVal;
    }
    const parsedVal = parseInt(value, radix);
    return isNaN(parsedVal) ? defaultVal : parsedVal;
  }

  static parseFloat(value: string, defaultVal: number): number {
    if (value === undefined || value === null) {
      return defaultVal;
    }
    const parsedVal = parseFloat(value);
    return isNaN(parsedVal) ? defaultVal : parsedVal;
  }

  static parseBool(value: string, defaultVal = false): boolean {
    if (!value) {
      return defaultVal;
    }
    return value.toLowerCase() === 'true';
  }

  static parseArray(value: string, defaultVal: any = [], delimiter = ','): string[] {
    if (!value) {
      return defaultVal;
    }
    return value.split(delimiter);
  }

  static replaceRegexes(text: string, replace: string, rules: Array<{ regex: string; group?: number; hide?: boolean }>): string {
    let replacedText = text;

    for (const rule of rules) {
      const group = rule.group ?? 1;
      const regex = new RegExp(rule.regex, 'g');
      const matches = replacedText.matchAll(regex);

      let match = matches.next();
      while (match && match.value?.length > group - 1) {
        replacedText = replacedText.replace(match.value[group], rule.hide ? `<Length ${match.value[group].length}>` : replace);
        match = matches.next();
      }
    }

    return replacedText;
  }

  static sanitizeText(text: string, replacement = '********'): string {
    const sensitiveDataRules = [
      { regex: 'password=([^&]*)' },
      { regex: '"password":\\s?"(.*?)"' },
      { regex: 'password:\\s?\\"(.*?)\\"' },
      { regex: 'password:\\s?\\\\"(.*?)\\\\"' },
      { regex: '"cookie":\\s?"(.*?)"' },
      { regex: '"Authorization":\\s?"(.*?)"' },
      { regex: 'data:(.+);base64,(.*)', group: 2, hide: true },
    ];

    return StringUtil.replaceRegexes(text, replacement, sensitiveDataRules);
  }

  static sanitizeData(data: any, replacement = '********'): any {
    const sensitiveKeys = ['password', 'authorization', 'cookie', 'accesstoken', 'refreshtoken', 'idtoken'];

    return ObjectUtil.transfromKeysAndValues(
      data,
      (key) => key,
      (key, value) => {
        if (sensitiveKeys.includes(key.toLowerCase())) {
          return replacement;
        }
        if (typeof value == 'string') {
          value = this.sanitizeText(value, replacement);
        }

        if (Array.isArray(value)) {
          const newArray = [];
          for (const item of value) {
            if (typeof item == 'string') {
              newArray.push(this.sanitizeText(item, replacement));
            } else {
              newArray.push(this.sanitizeData(item, replacement));
            }
          }
          value = newArray;
        }
        return value;
      },
    );
  }

  static fileSizeStringToBytes(fileSize: string): number {
    let sizeInBytes = 0;
    const units = ['k', 'm', 'g', 't'];

    if (!fileSize) {
      return sizeInBytes;
    }

    const matches = fileSize.matchAll(/([\d.]*)\s*([a-zA-Z]*)/g); // 1.5 MB
    const match = matches.next();

    if (match && match.value?.length > 0) {
      let multiplier = 1;
      const value = match.value[1];
      const unit = match.value[2];

      if (unit) {
        const index = units.indexOf(unit.toLowerCase().replace('b', ''));
        if (index !== -1) {
          multiplier = Math.pow(1000, index + 1);
        }
      }

      let numericalValue = 1;
      if (value) {
        const number = parseFloat(value);
        if (!isNaN(number)) {
          numericalValue = number;
        }
        sizeInBytes = numericalValue * multiplier;
      }
    }

    return Math.round(sizeInBytes);
  }

  static toNumericValue(text: string): number {
    const numericValue = parseFloat(text);
    const dateValue = Date.parse(text);
    return Number.isNaN(numericValue) ? (Number.isNaN(dateValue) ? +text : dateValue) : numericValue;
  }

  static randomString(length: number, pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
    return this.generateToken('string', length, undefined, { pool });
  }

  static generateToken(
    method: 'bytes' | 'string' | 'base32' | 'base62' | 'uuidv4' | 'uuidv5' = 'base62',
    length = 16,
    prefix?: string,
    options: DefaultGenerationOptions = {},
  ): string {
    return generateApiKey({
      method,
      length,
      prefix,
      ...options,
    }) as string;
  }

  static makeSlug(...values: string[]): string {
    return values
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z\d ]/g, '')
      .replace(/\s+/g, '-');
  }

  static pluralize(name: string): string {
    return pluralize && typeof pluralize === 'function' ? pluralize(name) : name + 's';
  }

  static camelToSnakeCase(text: string, divider = '-'): string {
    return text
      ?.split(/(?=[A-Z])/g)
      .join(divider)
      .toLowerCase();
  }
  static toggleToSnakeCase(text: string, divider = '-'): string {
    return text
      ?.replace(/([a-z0-9])([A-Z])/g, `$1${divider}$2`) // Convert "aB" to "a-b"
      .replace(/([A-Z])([A-Z][a-z])/g, `$1${divider}$2`) // Convert "ABCDef" to "ABC-Def"
      .toLowerCase(); // Convert to lower case
  }

  static snakeToCamelCase(text: string, divider = '-'): string {
    const regex = new RegExp(`${divider}[a-z0-9]`, 'g');
    return text?.replace(regex, (match) => match.replace(divider, '').toUpperCase());
  }

  static safeStringify(obj: any, indent = 2) {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      },
      indent,
    );
  }

  static safeJsonParse = <T>(str: string) => {
    try {
      const jsonValue: T = JSON.parse(str);
      return jsonValue;
    } catch {
      return undefined;
    }
  };
}
