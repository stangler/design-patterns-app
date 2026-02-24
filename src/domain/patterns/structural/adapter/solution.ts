// Adapter パターン: 互換性のないインターフェースを変換

/**
 * Target: クライアントが期待するインターフェース
 */
export interface MediaPlayer {
  play(filename: string): string;
}

/**
 * Adaptee: 既存のクラス（互換性がない）
 */
export class AdvancedMediaPlayer {
  public playVlc(filename: string): string {
    return `VLCプレーヤーで再生中: ${filename}`;
  }

  public playMp4(filename: string): string {
    return `MP4プレーヤーで再生中: ${filename}`;
  }
}

/**
 * Adapter: Adaptee を Target インターフェースに変換
 */
export class MediaAdapter implements MediaPlayer {
  private advancedPlayer: AdvancedMediaPlayer;

  constructor() {
    this.advancedPlayer = new AdvancedMediaPlayer();
  }

  public play(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'vlc':
        return this.advancedPlayer.playVlc(filename);
      case 'mp4':
        return this.advancedPlayer.playMp4(filename);
      default:
        return `対応していない形式: ${extension}`;
    }
  }
}

/**
 * 別の例: レガシーシステムのアダプター
 */
// レガシー: 氏名が "姓 名" 形式
export class LegacyUserSystem {
  public getUserInfo(): { fullName: string; age: number } {
    return { fullName: '山田 太郎', age: 25 };
  }
}

// 新システム: 名前を分けて管理
export interface ModernUser {
  firstName: string;
  lastName: string;
  age: number;
}

export class LegacyUserAdapter {
  constructor(private legacySystem: LegacyUserSystem) {}

  public getUser(): ModernUser {
    const { fullName, age } = this.legacySystem.getUserInfo();
    const [lastName, firstName] = fullName.split(' ');
    return { firstName, lastName, age };
  }
}

// 使用例
const adapter = new MediaAdapter();
console.log(adapter.play('movie.mp4'));  // MP4プレーヤーで再生中: movie.mp4
console.log(adapter.play('music.vlc'));  // VLCプレーヤーで再生中: music.vlc

// レガシーアダプターの使用例
const legacySystem = new LegacyUserSystem();
const userAdapter = new LegacyUserAdapter(legacySystem);
const modernUser = userAdapter.getUser();

console.log(modernUser); // { firstName: '太郎', lastName: '山田', age: 25 }