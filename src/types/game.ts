export interface GameStage {
  id: string;
  stage_number: number;
  riddle_text: string;
  answer_hash: string;
  qr_payload: string;
  location_clue: string;
  fragment_text: string;
  is_active: boolean;
}

export interface StageProgress {
  id: string;
  user_id: string;
  stage_id: string;
  answer_solved: boolean;
  qr_scanned: boolean;
  hints_used: number;
  completed_at: string | null;
}

export interface PlayerProgress {
  user_id: string;
  current_stage: number;
  game_completed: boolean;
  tutorial_completed_at: string | null;
  hints_used: number;
}

export interface FoundFragment {
  id: string;
  user_id: string;
  stage_id: string;
  stage_number: number;
  fragment_snapshot: string;
  image_url: string | null;
  unlocked_at: string;
}

export interface FoundQrCode {
  id: string;
  user_id: string;
  stage_id: string;
  stage_number: number;
  qr_payload: string;
  scanned_at: string;
}

export type StageState =
  | "locked"
  | "answer_pending"
  | "answer_correct_qr_pending"
  | "completed";

export interface StageWithState extends GameStage {
  state: StageState;
  answer_solved: boolean;
  qr_scanned: boolean;
  hints_used: number;
}

export interface ProgressSummary {
  current_stage: number;
  game_completed: boolean;
  tutorial_completed_at: string | null;
  hints_used: number;
  stages: StageWithState[];
  fragments: FoundFragment[];
  qr_codes: FoundQrCode[];
}
