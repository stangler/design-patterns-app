-- ================================
-- 学習管理テーブル
-- ================================

-- 学習進捗テーブル
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pattern_id)
);

-- クイズ回答履歴テーブル
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_id TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('implementation', 'advanced')),
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学習履歴テーブル
CREATE TABLE IF NOT EXISTS learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('view', 'start', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================
-- インデックス
-- ================================

CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_status ON learning_progress(status);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_pattern_id ON quiz_answers(pattern_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_user_id ON learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_created_at ON learning_history(created_at DESC);

-- ================================
-- RLS (Row Level Security)
-- ================================

ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;

-- 学習進捗: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own learning progress" ON learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress" ON learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress" ON learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- クイズ回答: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own quiz answers" ON quiz_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz answers" ON quiz_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 学習履歴: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own learning history" ON learning_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning history" ON learning_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================
-- 更新日時自動更新トリガー
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();