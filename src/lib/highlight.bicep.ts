import type { HLJSApi } from 'highlight.js';

const bicepHighlight = (hljs: HLJSApi) => {
    return {
        name: 'Bicep',
        case_insensitive: false,
        keywords: {
            keyword:
                'resource module param var output targetScope for in if existing import using extension metadata description minLength maxLength minValue maxValue allowed secure',
            type:
                'string int bool object array any',
            literal:
                'true false null',
            built_in:
                'resourceGroup subscription tenant managementGroup environment deployment concat format string length contains startsWith endsWith indexOf lastIndexOf substring replace split toLower toUpper trim uri uniqueString guid newGuid utcNow dateTimeAdd base64 base64ToJson base64ToString dataUri dataUriToString uriComponent uriComponentToString json skip take first last min max range union intersection'
        },
        contains: [
            // Single-line comments
            hljs.COMMENT('//', '$', {
                relevance: 0
            }),
            // Multi-line comments
            hljs.COMMENT('/\\*', '\\*/', {
                relevance: 0
            }),
            // Documentation comments (special highlighting)
            {
                className: 'comment',
                begin: '@description\\s*\\(',
                end: '\\)',
                relevance: 5
            },
            // Strings
            {
                className: 'string',
                variants: [
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    // Multi-line strings
                    {
                        begin: "'''",
                        end: "'''",
                        relevance: 5
                    }
                ]
            },
            // Numbers
            {
                className: 'number',
                variants: [
                    { begin: '\\b\\d+(\\.\\d+)?\\b' },
                    { begin: '\\b0x[a-fA-F0-9]+\\b' }
                ]
            },
            // Resource types and API versions
            {
                className: 'type',
                begin: "'Microsoft\\.[^']+@\\d{4}-\\d{2}-\\d{2}(-preview)?'",
                relevance: 5
            },
            // Property names
            {
                className: 'attr',
                begin: '\\w+\\s*:',
                end: ':',
                excludeEnd: true,
                relevance: 2
            },
            // Decorators
            {
                className: 'meta',
                begin: '@\\w+',
                relevance: 3
            },
            // Function calls
            {
                className: 'title.function',
                begin: '\\b\\w+(?=\\()',
                relevance: 2
            }
        ]
    };
}

export default bicepHighlight;