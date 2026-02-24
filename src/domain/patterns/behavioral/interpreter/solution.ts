// Interpreter パターン: 言語の文法を解釈

/**
 * Abstract Expression: 抽象式
 */
export interface Expression {
  interpret(context: Context): number;
}

/**
 * Context: 解釈のコンテキスト
 */
export class Context {
  private variables: Map<string, number> = new Map();

  public setVariable(name: string, value: number): void {
    this.variables.set(name, value);
  }

  public getVariable(name: string): number {
    const value = this.variables.get(name);
    if (value === undefined) {
      throw new Error(`変数 '${name}' が見つかりません`);
    }
    return value;
  }
}

/**
 * Terminal Expressions: 終端式
 */
export class NumberExpression implements Expression {
  constructor(private number: number) {}

  public interpret(_context: Context): number {
    return this.number;
  }
}

export class VariableExpression implements Expression {
  constructor(private name: string) {}

  public interpret(context: Context): number {
    return context.getVariable(this.name);
  }
}

/**
 * Non-terminal Expressions: 非終端式
 */
export class AddExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  public interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

export class SubtractExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  public interpret(context: Context): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}

export class MultiplyExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  public interpret(context: Context): number {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}

export class DivideExpression implements Expression {
  constructor(
    private left: Expression,
    private right: Expression
  ) {}

  public interpret(context: Context): number {
    const rightValue = this.right.interpret(context);
    if (rightValue === 0) {
      throw new Error('ゼロで除算することはできません');
    }
    return Math.floor(this.left.interpret(context) / rightValue);
  }
}

/**
 * Parser: 文字列を式に変換
 */
export class ExpressionParser {
  public parse(expression: string): Expression {
    const tokens = this.tokenize(expression);
    return this.buildExpression(tokens);
  }

  private tokenize(expression: string): string[] {
    return expression
      .replace(/\s+/g, '')
      .split(/([+\-*/()])/)
      .filter(token => token.length > 0);
  }

  private buildExpression(tokens: string[]): Expression {
    let index = 0;

    const parseExpression = (): Expression => {
      return parseAddSub();
    };

    const parseAddSub = (): Expression => {
      let left = parseMulDiv();

      while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
        const operator = tokens[index++];
        const right = parseMulDiv();
        left = operator === '+' 
          ? new AddExpression(left, right)
          : new SubtractExpression(left, right);
      }

      return left;
    };

    const parseMulDiv = (): Expression => {
      let left = parsePrimary();

      while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/')) {
        const operator = tokens[index++];
        const right = parsePrimary();
        left = operator === '*'
          ? new MultiplyExpression(left, right)
          : new DivideExpression(left, right);
      }

      return left;
    };

    const parsePrimary = (): Expression => {
      const token = tokens[index];

      if (token === '(') {
        index++; // '(' をスキップ
        const expr = parseExpression();
        index++; // ')' をスキップ
        return expr;
      }

      if (/^\d+$/.test(token)) {
        index++;
        return new NumberExpression(parseInt(token, 10));
      }

      if (/^[a-zA-Z]+$/.test(token)) {
        index++;
        return new VariableExpression(token);
      }

      throw new Error(`予期しないトークン: ${token}`);
    };

    return parseExpression();
  }
}

/**
 * 別の例: 日付フォーマット解析
 */
export interface DateFormatExpression {
  format(date: Date): string;
}

export class YearExpression implements DateFormatExpression {
  public format(date: Date): string {
    return date.getFullYear().toString();
  }
}

export class MonthExpression implements DateFormatExpression {
  public format(date: Date): string {
    return (date.getMonth() + 1).toString().padStart(2, '0');
  }
}

export class DayExpression implements DateFormatExpression {
  public format(date: Date): string {
    return date.getDate().toString().padStart(2, '0');
  }
}

export class LiteralExpression implements DateFormatExpression {
  constructor(private literal: string) {}

  public format(_date: Date): string {
    return this.literal;
  }
}

export class CompositeFormatExpression implements DateFormatExpression {
  private expressions: DateFormatExpression[] = [];

  public add(expression: DateFormatExpression): void {
    this.expressions.push(expression);
  }

  public format(date: Date): string {
    return this.expressions.map(e => e.format(date)).join('');
  }
}

export class DateFormatParser {
  public parse(format: string): DateFormatExpression {
    const composite = new CompositeFormatExpression();
    let i = 0;

    while (i < format.length) {
      if (format[i] === 'Y' || format[i] === 'y') {
        composite.add(new YearExpression());
        i++;
      } else if (format[i] === 'M' || format[i] === 'm') {
        composite.add(new MonthExpression());
        i++;
      } else if (format[i] === 'D' || format[i] === 'd') {
        composite.add(new DayExpression());
        i++;
      } else {
        let literal = '';
        while (i < format.length && !'YyMmDd'.includes(format[i])) {
          literal += format[i];
          i++;
        }
        composite.add(new LiteralExpression(literal));
      }
    }

    return composite;
  }
}

// 使用例
console.log('=== 数式インタープリター ===');
const parser = new ExpressionParser();
const context = new Context();

context.setVariable('x', 10);
context.setVariable('y', 5);

const expressions = [
  '1 + 2 * 3',           // 7
  '(1 + 2) * 3',         // 9
  'x + y',               // 15
  'x * y - 10',          // 40
  '100 / x + y',         // 15
];

for (const expr of expressions) {
  const expression = parser.parse(expr);
  const result = expression.interpret(context);
  console.log(`${expr} = ${result}`);
}

console.log('\n=== 日付フォーマットインタープリター ===');
const dateParser = new DateFormatParser();
const today = new Date('2026-02-24');

const formats = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'YYYY年MM月DD日',
];

for (const format of formats) {
  const formatter = dateParser.parse(format);
  const result = formatter.format(today);
  console.log(`${format} -> ${result}`);
}