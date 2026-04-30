const PATTERNS = {
    behavioral: [
        /tell me about a time/i,
        /give me an example of/i,
        /describe a situation (where|when)/i,
        /have you ever (had to|dealt|managed|worked|led|handled)/i,
        /walk me through a time/i,
        /share an example/i,
        /can you give me an instance/i,
        /talk about a time/i,
    ],
    system_design: [
        /design (a|an|the)\s+\w/i,
        /how would you (build|architect|scale|design)\b/i,
        /walk me through (how you.d|the architecture|your design)/i,
        /\barchitect\b.*(system|service|platform|api)/i,
        /scale (to|for)\s+\d/i,
        /how (do|would) you scale/i,
        /system design/i,
        // Explicit diagram/draw requests — always render the diagram
        /\b(draw|diagram|visualize|show me)\b.*(it|this|that|design|system|architecture)/i,
        /can you (draw|diagram|show|visualize)/i,
        /\b(draw it|show it|diagram it)\b/i,
    ],
    coding: [
        /write (a|an|the)?\s*function/i,
        /\bimplement\b.*(function|method|class|algorithm)/i,
        /given (this|an?\s)(input|array|string|list|tree|graph|matrix)/i,
        /what.?s the time complexity/i,
        /\bcode (it|this|that|a)\b/i,
        /solve (this|the following)/i,
        /\balgorithm\b.*(for|to)\b/i,
        /find (all|the)\s+\w+(in|from|of)\s+(an?|the)\s+(array|list|string)/i,
    ],
    self_reflection: [
        /greatest (weakness|flaw|area for improvement)/i,
        /tell me about a failure/i,
        /what would you do differently/i,
        /working on improving/i,
        /biggest mistake/i,
        /what are you (currently )?(working on|trying to improve)/i,
        /area(s)? (where|you) (you need|need) to (grow|improve)/i,
    ],
    culture: [
        /why (do you want|are you (leaving|interested in|applying))/i,
        /where do you see yourself in/i,
        /why (this|the|our) (company|role|position|team|org)/i,
        /what do you look for in (a|your next) (team|company|role|job)/i,
        /what (motivates|drives|excites) you/i,
        /tell me about yourself/i,
        /why (should we|would you be) (hire|a good)/i,
    ],
    resume: [
        /walk me through (this|your) (project|resume|background|experience|work)/i,
        /what was your (role|contribution) at\b/i,
        /tell me more about (your|the|this)\b/i,
        /what did you (actually |specifically )?(build|own|lead|do) (there|at|on)/i,
        /explain (your|the) work (at|on)\b/i,
    ],
    situational: [
        /what would you do if/i,
        /how would you handle\b/i,
        /imagine (you.?re|you are|you were) in a situation/i,
        /what.?s your approach when/i,
        /if you (were|had to|found yourself)/i,
        /suppose (you|your team)/i,
    ],
};

function classifyQuestion(text, conversationHistory = []) {
    // Context-aware: if the last AI message was asking design/coding clarifications,
    // the user is answering those questions — stay in that mode.
    if (conversationHistory.length > 0) {
        const lastAI = [...conversationHistory].reverse().find(m => m.role === 'assistant');
        if (lastAI && lastAI.content) {
            const c = lastAI.content;
            // AI just asked system design clarifying questions
            if (/before I (jump in|draw|design|start the design)/i.test(c) ||
                /couple of things that.ll shape the design/i.test(c) ||
                /what.s the expected (order|request|traffic|user) volume/i.test(c)) {
                return 'system_design';
            }
            // AI just asked coding clarifying questions
            if (/before I (start|write|code)/i.test(c) ||
                /just a couple quick things/i.test(c) ||
                /any language preference/i.test(c)) {
                return 'coding';
            }
        }
    }

    for (const [type, patterns] of Object.entries(PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(text)) return type;
        }
    }
    return 'technical';
}

module.exports = { classifyQuestion };
