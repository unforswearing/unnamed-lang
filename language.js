// syntax regex
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var primitiveRegex = {
    WHITESPACE: /\s+/,
    WORD: /w+/,
    COMMENT: /%/,
    VARIABLE_DECL: /\#\w+(?!=\[)/,
    LIST_DECL: /#\w+/,
    LIST_METHOD: /\.\w+/,
    CODE_BLOCK: /::/,
    LIST_ITEM: /,/,
    LIST_START: /\(/,
    LIST_END: /\)/,
    STRING: /^"([^"]*)"/,
    NUMBER: /^\d+\b/,
    TRUE: /true/,
    FALSE: /false/
};
var operatorRegex = {
    ADD: /\+/,
    SUBTRACT: /-/,
    MULTIPLY: /\*/,
    DIVIDE: /\//,
    BOOL_EQ: /===/,
    BOOL_NE: /!==/,
    BOOL_LT: /</,
    BOOL_GT: />/,
    BOOL_LE: /<=/,
    BOOL_GE: />=/
};
var reservedNames = __assign(__assign(__assign({}, operatorRegex), primitiveRegex), { BUILTIN: /@\w+/ });
// tokenizer
/*
 * Tiny tokenizer
 * https://gist.github.com/borgar/451393/7698c95178898c9466214867b46acb2ab2f56d68
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, 'invalid');
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 *
 */
function tokenize(s, parsers, deftok) {
    var m, r, l, t, tokens = [];
    while (s) {
        t = null;
        m = s.length;
        for (var key in parsers) {
            r = parsers[key].exec(s);
            // try to choose the best match if there are several
            // where "best" is the closest to the current starting point
            if (r && (r.index < m)) {
                t = {
                    token: r[0],
                    type: key,
                    matches: r.slice(1)
                };
                m = r.index;
            }
        }
        if (m) {
            // there is text between last token and currently 
            // matched token - push that out as default or "unknown"
            tokens.push({
                token: s.substr(0, m),
                type: deftok || 'unknown'
            });
        }
        if (t) {
            // push current token onto sequence
            tokens.push(t);
        }
        s = s.substr(m + (t ? t.token.length : 0));
    }
    return tokens;
}
var testExpr = "\n  #item(true)\n  @when(#item === true) \n    :: \"then block\"\n    :: \"else block\"\n";
var testRes = tokenize(testExpr, reservedNames, 'INVALID');
console.log(testRes);
// functions
var When = /** @class */ (function () {
    function When() {
        // comp = comparisonConstants
        this._ingest_args = function () { };
        this._ingest_then_else = function () { };
        // evaluate comparison expressions in constructor(?)
        // return if/then result
    }
    return When;
}());
var Mathematics = /** @class */ (function () {
    function Mathematics() {
        this._convert_str_to_num = function () { };
        this._ingest_expr = function () { };
        // evaluate math commands in constructor(?)
        // return math result
    }
    return Mathematics;
}());
var List = /** @class */ (function () {
    function List() {
        this._ingest_list_items = function () { };
        // do stuff to process lists
        // return list functions
    }
    return List;
}());
var Texts = /** @class */ (function () {
    function Texts() {
        this._convert_text_utf8 = function () { };
        // all text should be converted to utf8
        // return textd function
    }
    return Texts;
}());
// parser
