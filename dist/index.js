process.env.HMR_PORT=53263;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.js":[function(require,module,exports) {
"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")

// 
// init vars
//
let isDisabled = null
let whitespaceWasActive = null
// create a mainDecoration with nothing in it because we're not actually decorating any existing text 
// instead we're finding end-of-lines, then adding something after them, and then decorating that "something-after" thing
const mainDecoration = vscode.window.createTextEditorDecorationType({})
let activeEditor
let globalState
// the pattern to find the differnt line endings
const endOfLinePattern = /\r\n|\n|\r/g
let match
let theRenderOption
// each of the 4 render possibilities
let renderNewline
let renderReturn
let renderCrlf
let renderBlank

// 
// Update colors
//
function updateSettings() {
    //
    // import stuff from settings.json
    //
    let {
        style,
        newlineCharacter,
        newlineCharacterStyle,
        returnCharacter,
        returnCharacterStyle,
        crlfCharacter,
        crlfCharacterStyle,
        validLineEnding,
        toggleWithWhiteSpace,
    } = vscode.workspace.getConfiguration('code-eol')
    let whitespaceIsBeingRendered = vscode.workspace.getConfiguration('editor', null).get('renderWhitespace', false) != 'none'
    // make style editable (by default it is read only when its imported from settings)
    style = {
        // set default color to be the color of whitespace
        color: new vscode.ThemeColor('editorWhitespace.foreground'),
        ...style
    }

    // 
    // Check for non-default line endings
    // 
    if (validLineEnding != null) {
        const themeErrorColor = new vscode.ThemeColor('errorForeground')
        if (validLineEnding == 'LF') {
            crlfCharacterStyle   = { color: themeErrorColor, ...crlfCharacterStyle  }
            returnCharacterStyle = { color: themeErrorColor, ...returnCharacterStyle}
        } else if (validLineEnding == 'CRLF') {
            newlineCharacterStyle = { color: themeErrorColor, ...newlineCharacterStyle}
            returnCharacterStyle  = { color: themeErrorColor, ...returnCharacterStyle }
        }
    }

    // convert opacity into a string (not sure why it fails when its a number)
    if (typeof style.opacity == "number") { style.opacity = `${style.opacity}` }
    newlineCharacterStyle = {...newlineCharacterStyle}; if (typeof newlineCharacterStyle.opacity == "number") { newlineCharacterStyle.opacity = `${newlineCharacterStyle .opacity}` }
    returnCharacterStyle  = {...returnCharacterStyle }; if (typeof returnCharacterStyle .opacity == "number") { returnCharacterStyle .opacity = `${returnCharacterStyle  .opacity}` }
    crlfCharacterStyle    = {...crlfCharacterStyle   }; if (typeof crlfCharacterStyle   .opacity == "number") { crlfCharacterStyle   .opacity = `${crlfCharacterStyle    .opacity}` }
    
    // set the style/look/decoration of each line ending
    renderNewline = { after: { contentText: newlineCharacter, ...style, ...newlineCharacterStyle } }
    renderReturn  = { after: { contentText: returnCharacter , ...style, ...returnCharacterStyle  } }
    renderCrlf    = { after: { contentText: crlfCharacter   , ...style, ...crlfCharacterStyle    } }
    renderBlank   = { after: { contentText: ''              , ...style,                 } }
    
    // 
    // Check for change in showing whitespace (check for if it should be toggled)
    // 
    if (whitespaceWasActive != whitespaceIsBeingRendered) {
        // save change to perisitant storage
        whitespaceWasActive = !whitespaceWasActive
        if (globalState) {
            globalState.update("whitespaceWasActive", whitespaceWasActive)
        }
        // if user has setting enabled
        if (toggleWithWhiteSpace) {
            if (whitespaceIsBeingRendered) {
                isDisabled = false
            } else {
                isDisabled = true
            }
            if (globalState) {
                globalState.update("codeEolIsDisabled", isDisabled)
            }
        }
    }
} 


// 
// this method is called when vs code is initally opened
// 
exports.activate = function activate(context) {
    // set the active editor
    activeEditor = vscode.window.activeTextEditor
    // set the globalState
    globalState = context.globalState
    // get the isDisabled setting
    isDisabled          = context.globalState.get("codeEolIsDisabled")
    whitespaceWasActive = context.globalState.get("whitespaceWasActive")
    let isRunningV1     = context.globalState.get("isRunningV1")


    updateSettings()
    
    // update message for v1
    if (isRunningV1 != true) {
        vscode.window.showInformationMessage('Hey! The big update to code-eol might break the look of your line-endings. Check the extension homepage for more details')
        if (globalState) {
            globalState.update("isRunningV1", true)
        }
    }

    // 
    // bind updateDecorations()
    // 
    // updateDecorations on activation
    updateDecorations()
    // updateDecorations whenever the doc changes 
    vscode.workspace.onDidChangeTextDocument(()=>updateDecorations(), null, context.subscriptions)
    // updateDecorations when the editor changes (aka new tab)
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)

    // 
    // when the user changes settings, update the color varaibles
    // 
    vscode.workspace.onDidChangeConfiguration(() => {
        updateSettings()
        updateDecorations()
    }, null, context.subscriptions)
}

// 
// the render function for actually showing newlines
// 
function updateDecorations(editor) {
    // if there is a new editor (aka new tab), then update activeEditor
    if (editor) { activeEditor = editor }
    // if somehow there is no active editor, then just return
    if (!activeEditor) { return }
    
    // if this called by onDidChangeTextDocument(), 
    // then the text string will only be the text that changed
    // (it wont be the text of the entire file)
    const document = activeEditor.document
    const text = document.getText()
    const newLines = []
    
    // if disabled, update the page to show nothing (otherwise the old line endings will stick around)
    if (isDisabled) {
        activeEditor.setDecorations(mainDecoration, newLines)
    // if enabled then continue to render everything
    } else {
        // loop through every line ending match
        while (match = endOfLinePattern.exec(text)) {
            // find which ending this particular match is
            switch (match[0]) {
                case '\n'  : theRenderOption = renderNewline; break
                case '\r\n': theRenderOption = renderCrlf   ; break
                case '\r'  : theRenderOption = renderReturn ; break
                default    : theRenderOption = renderBlank  ; break
            }
            let startingPosition = document.positionAt(match.index)
            let lineDecoration = {
                // just use startPos twice since we dont want to decorate any existing text
                range: new vscode.Range(startingPosition, startingPosition),
                renderOptions: theRenderOption
            }
            newLines.push(lineDecoration)
        }
        if (activeEditor.setDecorations) {
            activeEditor.setDecorations(mainDecoration, newLines)
        }
    }
}

// 
// register a command for toggling the line endings
// 
vscode.commands.registerCommand('extension.toggleLineEndings', () => {
    // disable the flag
    isDisabled = !isDisabled
    // then tell the current file to update (either add or remove the line endings)
    updateDecorations()
    // after render, change toggle the storage option too
    // (this makes the setting perisitant even after restarting vs code)
    if (globalState) {
        globalState.update("codeEolIsDisabled", isDisabled)
    }
})


},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id)
  });
}

},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.map