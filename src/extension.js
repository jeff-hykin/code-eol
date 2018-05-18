"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");

// this method is called when vs code is activated
function activate(context) {
    // get color at start
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const decorationColor = configuration.color
    // get characters at start
    const newline_char = configuration.newlineCharacter ? configuration.newlineCharacter : '↓'
    const return_char  = configuration.returnCharacter  ? configuration.returnCharacter  : '←'
    const crlf_char    = configuration.crlfCharacter    ? configuration.crlfCharacter    : '↵'
    // init some vars outside of updateDecorations for efficiency
    const render_newline = { after: { contentText: newline_char, color: decorationColor } }
    const render_return  = { after: { contentText: return_char, color : decorationColor } }
    const render_crlf    = { after: { contentText: crlf_char, color   : decorationColor } }
    const render_blank   = { after: { contentText: '', color          : decorationColor } }
    var match
    var the_render_option
    const regEx = /(\r(?!\n))|(\r?\n)/g
    // create a decorator type that we use to decorate small numbers
    var nullDecoration = vscode.window.createTextEditorDecorationType({});
    var activeEditor = vscode.window.activeTextEditor;

    function updateDecorations(editor) {
        // if there is a new editor, then update activeEditor
        if (editor) { activeEditor = editor }
        // if somehow there is no active editor, then just return
        if (!activeEditor) {return}
        
        const document = activeEditor.document
        var text = document.getText()
        var newLines = []
        // loop through every newline
        while ((match = regEx.exec(text))) {
            switch (match[0]) {
                case '\n': the_render_option = render_newline; break
                case '\r\n': the_render_option = render_crlf; break
                case '\r': the_render_option = render_return; break
                default: the_render_option = render_blank; break
            }
            var startPos = document.positionAt(match.index)
            var decoration = {
                // just use startPos twice since it really doesnt matter
                range: new vscode.Range(startPos, startPos),
                renderOptions: the_render_option
            }
            newLines.push(decoration)
        }
        activeEditor.setDecorations(nullDecoration, newLines)
    }
    
    // if there is an active editor then go ahead an updateDecorations
    if (activeEditor) { updateDecorations() }
    // updateDecorations whenever the doc changes
    vscode.workspace.onDidChangeTextDocument(updateDecorations, null, context.subscriptions)
    // when the editor changes, updateDecorations
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)
}
exports.activate = activate
//# sourceMappingURL=extension.js.map
