// Memento パターン: 状態を保存・復元

/**
 * Memento: 状態のスナップショット
 */
export class EditorMemento {
  constructor(private readonly content: string, private readonly cursorPosition: number) {}

  public getContent(): string {
    return this.content;
  }

  public getCursorPosition(): number {
    return this.cursorPosition;
  }
}

/**
 * Originator: 状態を持つオブジェクト
 */
export class TextEditor {
  private content: string = '';
  private cursorPosition: number = 0;

  public write(text: string): void {
    this.content += text;
    this.cursorPosition = this.content.length;
  }

  public delete(n: number): void {
    this.content = this.content.slice(0, -n);
    this.cursorPosition = this.content.length;
  }

  public getContent(): string {
    return this.content;
  }

  public setCursorPosition(position: number): void {
    this.cursorPosition = Math.min(position, this.content.length);
  }

  // 現在の状態を保存
  public save(): EditorMemento {
    return new EditorMemento(this.content, this.cursorPosition);
  }

  // 保存した状態から復元
  public restore(memento: EditorMemento): void {
    this.content = memento.getContent();
    this.cursorPosition = memento.getCursorPosition();
  }

  public display(): string {
    return `📝 "${this.content}" (cursor: ${this.cursorPosition})`;
  }
}

/**
 * Caretaker: Mementoを管理
 */
export class EditorHistory {
  private history: EditorMemento[] = [];
  private currentIndex: number = -1;

  public push(memento: EditorMemento): void {
    // 現在位置以降の履歴を削除（新しい分岐）
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(memento);
    this.currentIndex++;
  }

  public undo(): EditorMemento | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  public redo(): EditorMemento | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  public canUndo(): boolean {
    return this.currentIndex > 0;
  }

  public canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
}

/**
 * 別の例: ゲームのセーブ
 */
export class GameState {
  constructor(
    public readonly level: number,
    public readonly score: number,
    public readonly health: number,
    public readonly position: { x: number; y: number }
  ) {}
}

export class Game {
  private level: number = 1;
  private score: number = 0;
  private health: number = 100;
  private position: { x: number; y: number } = { x: 0, y: 0 };

  public play(score: number): void {
    this.score += score;
  }

  public takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
  }

  public move(x: number, y: number): void {
    this.position = { x, y };
  }

  public nextLevel(): void {
    this.level++;
  }

  public save(): GameState {
    return new GameState(this.level, this.score, this.health, { ...this.position });
  }

  public load(state: GameState): void {
    this.level = state.level;
    this.score = state.score;
    this.health = state.health;
    this.position = { ...state.position };
  }

  public display(): string {
    return `🎮 Lv.${this.level} Score:${this.score} HP:${this.health} Pos:(${this.position.x},${this.position.y})`;
  }
}

// 使用例
console.log('=== テキストエディタのUndo/Redo ===');
const editor = new TextEditor();
const history = new EditorHistory();

// 初期状態を保存
history.push(editor.save());

editor.write('Hello');
history.push(editor.save());
console.log(editor.display());

editor.write(' World');
history.push(editor.save());
console.log(editor.display());

editor.delete(6);
console.log('削除後:', editor.display());

// Undo
if (history.canUndo()) {
  editor.restore(history.undo()!);
  console.log('Undo:', editor.display());
}

// もう一度Undo
if (history.canUndo()) {
  editor.restore(history.undo()!);
  console.log('Undo:', editor.display());
}

// Redo
if (history.canRedo()) {
  editor.restore(history.redo()!);
  console.log('Redo:', editor.display());
}

console.log('\n=== ゲームセーブ ===');
const game = new Game();
const saves: GameState[] = [];

game.play(100);
game.move(50, 30);
console.log(game.display());
saves.push(game.save()); // セーブ1

game.nextLevel();
game.play(200);
game.takeDamage(30);
console.log(game.display());
saves.push(game.save()); // セーブ2

// 最初のセーブからロード
game.load(saves[0]);
console.log('セーブ1からロード:', game.display());