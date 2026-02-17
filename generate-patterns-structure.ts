import fs from "fs";
import path from "path";

type Category = "creational" | "structural" | "behavioral";

interface Pattern {
  name: string;
  category: Category;
}

const patterns: Pattern[] = [
  { name: "Singleton", category: "creational" },
  { name: "FactoryMethod", category: "creational" },
  { name: "AbstractFactory", category: "creational" },
  { name: "Builder", category: "creational" },
  { name: "Prototype", category: "creational" },
  { name: "Adapter", category: "structural" },
  { name: "Bridge", category: "structural" },
  { name: "Composite", category: "structural" },
  { name: "Decorator", category: "structural" },
  { name: "Facade", category: "structural" },
  { name: "Flyweight", category: "structural" },
  { name: "Proxy", category: "structural" },
  { name: "ChainOfResponsibility", category: "behavioral" },
  { name: "Command", category: "behavioral" },
  { name: "Interpreter", category: "behavioral" },
  { name: "Iterator", category: "behavioral" },
  { name: "Mediator", category: "behavioral" },
  { name: "Memento", category: "behavioral" },
  { name: "Observer", category: "behavioral" },
  { name: "State", category: "behavioral" },
  { name: "Strategy", category: "behavioral" },
  { name: "TemplateMethod", category: "behavioral" },
  { name: "Visitor", category: "behavioral" },
];

const baseDir = path.join(process.cwd(), "src/domain/patterns");

patterns.forEach(({ name, category }) => {
  const id = name.toLowerCase();
  const patternDir = path.join(baseDir, category, id);
  fs.mkdirSync(patternDir, { recursive: true });

  fs.writeFileSync(
    path.join(patternDir, 'explanation.md'),
`# ${name}

## 概要
${name} パターンの目的と構造を説明する。

## 主な登場人物
- 役割1
- 役割2

## 使う場面
- 具体的なユースケースを書く
`
  );

  fs.writeFileSync(
    path.join(patternDir, 'question.md'),
`# ${name} 問題

## 🎯 学習目標
- ${name} の構造を理解する
- TypeScriptで実装できるようになる

## 💻 実装課題
- インターフェースを定義する
- 具体クラスを作成する
- テストが通るようにする

## 🔍 発展課題
- 他の類似パターンとの違いは？
`
  );

  fs.writeFileSync(
    path.join(patternDir, 'solution.ts'),
`// ${name} solution example

export interface I${name} {
  execute(): string;
}

export class Concrete${name} implements I${name} {
  execute(): string {
    return '${name} executed';
  }
}
`
  );

  console.log(`✔ Created: ${category}/${id}`);
});

console.log('🎉 All 23 patterns generated successfully!');