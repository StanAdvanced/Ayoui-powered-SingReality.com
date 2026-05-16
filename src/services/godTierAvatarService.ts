// Avatar client service hitting proxy route
export async function askGodTierAvatar(inputText: string, chatHistory: any[]) {
    try {
        const res = await fetch("/api/avatar/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputText, chatHistory })
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Network error");
        }
        
        const data = await res.json();
        return data.response;
    } catch (error) {
        console.error("Avatar AI Error:", error);
        return "Ah, standard matrix glitch. But we persist! Ask me anything else while my nanobots repair the link.";
    }
}
