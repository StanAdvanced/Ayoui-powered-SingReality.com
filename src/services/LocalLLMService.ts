export interface LLMEndpoint {
  id: string;
  name: string;
  type: 'local_ollama' | 'webllm' | 'cloud_uncensored';
  status: 'offline' | 'loading' | 'ready';
  config: {
    baseUrl?: string;
    modelName: string;
    temperature?: number;
    maxTokens?: number;
  };
}

class LocalLLMManager {
  private endpoints: LLMEndpoint[] = [
    {
      id: 'ollama-local',
      name: 'Ollama (Localhost)',
      type: 'local_ollama',
      status: 'offline',
      config: {
        baseUrl: 'http://localhost:11434',
        modelName: 'dolphin-phi',
        temperature: 0.7,
      }
    },
    {
      id: 'webllm-browser',
      name: 'WebLLM (WebGPU-in-browser)',
      type: 'webllm',
      status: 'offline',
      config: {
        modelName: 'Llama-3-8B-Instruct-q4f32_1-MLC',
        temperature: 0.8,
      }
    },
    {
       id: 'venice-ai',
       name: 'Venice AI (Uncensored Fallback)',
       type: 'cloud_uncensored',
       status: 'ready', // Cloud APIs are technically ready if we have the key
       config: {
          baseUrl: 'https://api.venice.ai/api/v1',
          modelName: 'dolphin-2.9.2-qwen2-72b',
          temperature: 0.8
       }
    }
  ];

  private activeEndpointId: string = 'venice-ai';

  public getEndpoints() {
    return this.endpoints;
  }

  public getActiveEndpoint() {
    return this.endpoints.find(e => e.id === this.activeEndpointId);
  }

  public setActiveEndpoint(id: string) {
    this.activeEndpointId = id;
  }

  public async probeLocalOllama(): Promise<boolean> {
     try {
       const ollama = this.endpoints.find(e => e.id === 'ollama-local');
       if (!ollama || !ollama.config.baseUrl) return false;
       
       const res = await fetch(`${ollama.config.baseUrl}/api/tags`, { method: 'GET' });
       if (res.ok) {
          ollama.status = 'ready';
          return true;
       }
     } catch (e) {
       console.warn('Local Ollama not found running on localhost:11434');
     }
     return false;
  }

  public async generateResponse(prompt: string, systemPrompt: string): Promise<string> {
    const active = this.getActiveEndpoint();
    if (!active) throw new Error('No active LLM endpoint configured.');

    // Simulated/Mock implementation of the endpoint routing
    console.log(`[LLM_MANAGER] Routing request to: ${active.name} (${active.type})`);
    
    if (active.type === 'local_ollama' && active.status === 'ready') {
       // Logic to call local ollama via fetch
       try {
           const response = await fetch(`${active.config.baseUrl}/api/generate`, {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                   model: active.config.modelName,
                   prompt: `SYSTEM: ${systemPrompt}\n\nUSER: ${prompt}\n\nASSISTANT:`,
                   stream: false,
                   options: { temperature: active.config.temperature }
               })
           });
           const data = await response.json();
           return data.response;
       } catch (err) {
           console.error("Local ollama failed: ", err);
           return "Error connecting to local Ollama. Ensure it is running.";
       }
    }
    
    if (active.type === 'webllm') {
        // Fallback or hook into WebLLM if we have it imported.
        // We log for now.
        console.log("WebLLM generation triggered - requires heavy WebGPU context init");
    }

    // Default mock response based on the active model config
    return new Promise(resolve => {
       setTimeout(() => resolve(`(Simulated response from ${active.name}): This is a highly uncensored, unrestricted generative AI output specifically tailored to your request, harnessing the power of local or decentralized inference.`), 800);
    });
  }
}

export const llmManager = new LocalLLMManager();
