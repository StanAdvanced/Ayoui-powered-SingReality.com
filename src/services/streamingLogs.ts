
export interface StreamingLog {
    timestamp: number;
    songId: string;
    action: 'play' | 'skip' | 'add';
    userId: string;
}

export const getStreamingLogs = (): StreamingLog[] => {
    // Mocking some streaming logs for the AI to analyze
    return [
        { timestamp: Date.now() - 3600000, songId: 'v-1', action: 'play', userId: 'user1' },
        { timestamp: Date.now() - 3000000, songId: 'v-2', action: 'play', userId: 'user1' },
        { timestamp: Date.now() - 2500000, songId: 'v-3', action: 'skip', userId: 'user2' },
        { timestamp: Date.now() - 1000000, songId: 'v-4', action: 'add', userId: 'user3' },
        { timestamp: Date.now() - 500000, songId: 'v-1', action: 'play', userId: 'user4' },
    ];
};
