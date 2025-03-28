import * as vm from 'vm';
export class ObjectTemplateParser {
  public static parse(template, templateValues) {
    try {
      if (typeof template === 'string') {
        if (template.startsWith('=')) {
          const expression = template.slice(1);
          const replacedExpression = expression.replace(/{{(.*?)}}/g, function (_, g1) {
            const path = g1.split('.');
            let result = templateValues;
            for (const p of path) {
              if (result[p] === undefined) {
                throw new Error(`Missing template parameter: ${p}`);
              }
              result = result[p];
            }
            return result;
          });
          try {
            return ObjectTemplateParser._evaluateExpression(replacedExpression);
          } catch (error) {
            throw new Error(`Expression Evaluation error : ${error.message} for expression: ${replacedExpression}`);
          }
        } else {
          return template.replace(/{{(.*?)}}/g, function (_, g1) {
            const path = g1.split('.');
            let result = templateValues;
            for (const p of path) {
              if (result[p] === undefined) {
                throw new Error(`Missing template parameter: ${p}`);
              }
              result = result[p];
            }
            return result;
          });
        }
      } else if (Array.isArray(template)) {
        return template.map(function (t) {
          return ObjectTemplateParser.parse(t, templateValues);
        });
      } else if (typeof template === 'object' && template !== null) {
        if (template.hasOwnProperty('$_value')) {
          switch (template.$_type) {
            case 'string':
              return String(ObjectTemplateParser.parse(template.$_value, templateValues));
            case 'number':
              return parseFloat(Number(ObjectTemplateParser.parse(template.$_value, templateValues))?.toFixed(10));
            case 'boolean':
              return Boolean(ObjectTemplateParser.parse(template.$_value, templateValues));
            default:
              return ObjectTemplateParser.parse(template.$_value, templateValues);
          }
        } else {
          const result = {};
          for (const key in template) {
            result[key] = ObjectTemplateParser.parse(template[key], templateValues);
          }
          return result;
        }
      } else {
        return template;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private static _evaluateExpression(code: string, context: vm.Context = {}, opts?: vm.ScriptOptions) {
    const sandbox = {};
    const resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000);
    sandbox[resultKey] = {};
    const clearContext = `
      (function() {
        Function = undefined;
        const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
        keys.forEach((key) => {
          const item = this[key];
          if (!item || typeof item.constructor !== 'function') return;
          this[key].constructor = undefined;
        });
      })();
    `;
    code = clearContext + resultKey + '=' + code;
    if (context) {
      Object.keys(context).forEach(function (key) {
        sandbox[key] = context[key];
      });
    }
    vm.runInNewContext(code, sandbox, opts);
    return sandbox[resultKey];
  }
}
