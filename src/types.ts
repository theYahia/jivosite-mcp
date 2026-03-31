export interface JivoChat {
  chat_id: string;
  status: string;
  client_name?: string;
  created_at?: string;
  agent_id?: string;
}

export interface JivoAgent {
  agent_id: string;
  name: string;
  email?: string;
  status?: string;
}

export interface JivoVisitor {
  visitor_id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  last_seen?: string;
}
