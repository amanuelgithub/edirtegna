import { registerDecorator, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            this.error = 'Empty password';
            return false;
          }
          const result = zxcvbn(value);
          if (result.score === 0) {
            this.error = `Password is too weak. ${result?.feedback?.warning}`;
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          console.log('this.error:', this.error);

          return this.error || 'Something went wrong';
        },
      },
    });
  };
}
/* 
{
  password: '123456',
  guesses: 2,
  guesses_log10: 0.30102999566398114,
  sequence: [
    {
      pattern: 'dictionary',
      i: 0,
      j: 5,
      token: '123456',
      matched_word: '123456',
      rank: 1,
      dictionary_name: 'passwords',
      reversed: false,
      l33t: false,
      base_guesses: 1,
      uppercase_varedirtegnaions: 1,
      l33t_varedirtegnaions: 1,
      guesses: 1,
      guesses_log10: 0
    }
  ],
  calc_time: 7,
  crack_times_seconds: {
    online_throttling_100_per_hour: 72,
    online_no_throttling_10_per_second: 0.2,
    offline_slow_hashing_1e4_per_second: 0.0002,
    offline_fast_hashing_1e10_per_second: 2e-10
  },
  crack_times_display: {
    online_throttling_100_per_hour: '1 minute',
    online_no_throttling_10_per_second: 'less than a second',
    offline_slow_hashing_1e4_per_second: 'less than a second',
    offline_fast_hashing_1e10_per_second: 'less than a second'
  },
  score: 0,
  feedback: {
    warning: 'This is a top-10 common password',
    suggestions: [ 'Add another word or two. Uncommon words are better.' ]
  }
} 

*/
