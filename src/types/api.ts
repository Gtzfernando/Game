import { StageState } from "./game";

export interface AnswerRequest {
  answer: string;
}

export interface AnswerResponse {
  success: boolean;
  state: StageState;
  location_clue: string;
}

export interface QrRequest {
  payload: string;
}

export interface QrResponse {
  success: boolean;
  next_route: string;
}

export interface ProgressResponse {
  current_stage: number;
  game_completed: boolean;
  tutorial_completed_at: string | null;
  stages: Array<{
    stage_number: number;
    state: StageState;
    riddle_text: string;
  }>;
  fragments: Array<{
    stage_number: number;
    fragment_text: string;
  }>;
  qr_codes: Array<{
    stage_number: number;
    qr_payload: string;
  }>;
}
