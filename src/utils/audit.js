const entries = [];

// ─── Truncation detection ────────────────────────────────────────────────────

function checkTruncation(text) {
    if (!text || text.length < 30) return null;
    const fences = (text.match(/^```/gm) || []).length;
    if (fences % 2 !== 0) return 'unclosed_code_fence';
    // Ends mid-word (no sentence-ending punctuation or closing fence)
    const trimmed = text.trimEnd();
    const last = trimmed[trimmed.length - 1];
    const endedClean = '.!?`"\':\\])'.includes(last) || trimmed.endsWith('```');
    if (trimmed.length > 80 && !endedClean) return 'mid_sentence';
    return null;
}

// ─── Format fixer ────────────────────────────────────────────────────────────
// Strips markdown headers and bullet lists that leak through despite prompt rules.
// Applied once after the stream ends — before storing in history and sending final
// update to the renderer.

function fixFormat(text) {
    if (!text) return text;
    return text
        // Convert headers to bold inline (## Title → **Title**)
        .replace(/^#{1,4} (.+)$/gm, '**$1**')
        // Strip bullet markers (-, *, •) — keep the line content
        .replace(/^[ \t]*[-*•] (.+)$/gm, '$1')
        // Strip numbered list markers (1. Item → Item)
        .replace(/^[ \t]*\d+\. (.+)$/gm, '$1')
        // Collapse 3+ blank lines to 2
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// ─── Classification validator ─────────────────────────────────────────────────
// Checks if the response type matches what the response actually contains.
// Returns a warning string or null.

function validateClassification(questionType, responseText) {
    if (!responseText) return null;
    const hasCode = /```[\w]*\n/.test(responseText);
    const hasMermaid = /```mermaid/.test(responseText);
    if (hasCode && !['coding', 'system_design'].includes(questionType)) {
        return `response_has_code_but_classified_as_${questionType}`;
    }
    if (hasMermaid && questionType !== 'system_design') {
        return `response_has_diagram_but_classified_as_${questionType}`;
    }
    return null;
}

// ─── Audit log ───────────────────────────────────────────────────────────────

function record({ provider, questionType, maxTokens, historyChars, responseChars, truncationReason, classificationWarning, isRetry }) {
    const entry = {
        ts: Date.now(),
        provider,
        questionType,
        maxTokens,
        historyChars,
        responseChars: responseChars || 0,
        truncationReason: truncationReason || null,
        classificationWarning: classificationWarning || null,
        isRetry: !!isRetry,
    };
    entries.push(entry);
    if (entries.length > 100) entries.shift();

    const flags = [
        truncationReason ? `⚠ TRUNCATED(${truncationReason})` : null,
        classificationWarning ? `⚠ CLASSIFY(${classificationWarning})` : null,
        isRetry ? '↺ RETRY' : null,
    ].filter(Boolean).join(' ');

    console.log(
        `[Audit] ${provider} type=${questionType} tokens=${maxTokens} ` +
        `histChars=${historyChars} respChars=${responseChars || 0}` +
        (flags ? ` ${flags}` : '')
    );
}

function getLog() { return entries.slice(); }

module.exports = { checkTruncation, fixFormat, validateClassification, record, getLog };
