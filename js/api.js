/**
 * API Wrapper for Backend connection (Optional usage in MVP)
 * 
 * Demonstrates the production-ready architecture where 
 * stats can be validated or stored server-side.
 */
class CounterAPI {
    static async analyzeText(text) {
        try {
            const response = await fetch('/api/analyze-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('API Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in API text analysis:', error);
            // Fallback for offline usage
            return null;
        }
    }

    static async checkHealth() {
        try {
            const response = await fetch('/api/health');
            return response.ok;
        } catch (e) {
            return false;
        }
    }
}
