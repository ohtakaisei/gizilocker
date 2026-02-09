export interface SessionResponse {
  session_id: string;
  meeting_name: string;
}

export interface DocumentResponse {
  filename: string;
  chunk_count: number;
}

export interface TranscriptionResponse {
  session_id: string;
  text: string;
  language: string;
  duration: number;
}

export interface MinutesResponse {
  session_id: string;
  minutes: string;
  transcription_text: string;
  document_count: number;
}

export interface SessionHealthResponse {
  session_id: string;
  audio_chunks: number;
  documents: number;
  has_transcription: boolean;
}
