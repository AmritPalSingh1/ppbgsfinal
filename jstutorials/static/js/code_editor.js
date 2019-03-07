/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./jstutorials/editor_src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./jstutorials/editor_src/codeEditor.js":
/*!**********************************************!*\
  !*** ./jstutorials/editor_src/codeEditor.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _codeRunner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codeRunner.js */ "./jstutorials/editor_src/codeRunner.js");
/* global $, CodeMirror, jsyaml */



const sharedConfig = {
  autoCloseBrackets: true,
  extraKeys: {
    Tab: 'insertSoftTab',
  },
  gutters: ['CodeMirror-lint-markers'],
  lineNumbers: true,
  scrollbarStyle: 'simple',
  scrollPastEnd: true,
  tabSize: 2,
  theme: 'neo',
};

// create codemirror instances.
const editors = {
  html: CodeMirror($('#html-editor')[0], {
    ...sharedConfig,
    mode: 'htmlmixed',
    autoCloseTags: true,
    lint: true,
  }),
  js: CodeMirror($('#js-editor')[0], {
    ...sharedConfig,
    mode: 'javascript',
    lint: {
      esversion: 6,
    },
  }),
};

editors.js.on('change', () => Object(_codeRunner_js__WEBPACK_IMPORTED_MODULE_0__["runCode"])(editors));

fetch('/static/mock_data/exercise_canvas.yml')
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    Object(_codeRunner_js__WEBPACK_IMPORTED_MODULE_0__["setState"])({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(() => {
      const { errorCount } = Object(_codeRunner_js__WEBPACK_IMPORTED_MODULE_0__["getState"])();
      const threshold = data.test.errorThreshold;
      const submitData = {
        errorCount,
        grade: Math.max((threshold - errorCount), 0) / threshold,
        usedHint: localStorage.getItem('usedHint') === 'true',
      };

      console.log(submitData);
    });

    // insert data to the page
    $('#task-placeholder').html(data.task);
    $('#hint-body').html(data.hint);
    editors.html.setValue(data.html);
    editors.js.setValue(data.js);

    Object(_codeRunner_js__WEBPACK_IMPORTED_MODULE_0__["runCode"])(editors);
  });


/***/ }),

/***/ "./jstutorials/editor_src/codeRunner.js":
/*!**********************************************!*\
  !*** ./jstutorials/editor_src/codeRunner.js ***!
  \**********************************************/
/*! exports provided: log, fail, runCode, setState, getState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fail", function() { return fail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "runCode", function() { return runCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setState", function() { return setState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getState", function() { return getState; });
/* harmony import */ var loop_protect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! loop-protect */ "./node_modules/loop-protect/dist/index.js");
/* harmony import */ var loop_protect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(loop_protect__WEBPACK_IMPORTED_MODULE_0__);
/* global $, Babel */
/* eslint-disable no-console */



let state = {
  // secret javascript code not shown to the user
  secret: '',
  // a testing 'suite' ran against user code
  codeChecks: {
    setup: '', // run before user code
    run: '', // run after user code
    cleanup: '', // runs last
    has: [], // checks if code contains a pattern
    hasNot: [], // opposite of 'has'
    maxLines: 200, // max number of lines user should code
    errorThreshold: 0, // (errorThreshold - errorCount) / errorThreshold = grade
  },
  errorCount: 0,
};

const log = x => {
  $('#console-output').append(`<samp>${x}</samp><br />`);
  console.log(x);
};

const fail = x => {
  state.errorCount++;
  $('#console-output').append(
    `<code><i class="fas fa-times-circle"></i> ${x}</code><br />`,
  );
  console.error(x);
};

Babel.registerPlugin('loopProtection', loop_protect__WEBPACK_IMPORTED_MODULE_0___default()(200, line => {
  const err = new Error(`Possible infinite loop on line ${line}`);
  throw err;
}));

const transform = source => Babel.transform(source, {
  plugins: ['loopProtection'],
}).code;

window.transform = transform;

// write code to the iframe
const writeToFrame = code => {
  const iframeDocument = $('iframe')[0].contentWindow.document;

  iframeDocument.open();
  iframeDocument.write(code);
  iframeDocument.close();
};

const escapeCode = str =>
  str
    .replace(/\\/g, '\\\\') // preserve backslash
    .replace(/[\n\r]/g, '\\n') // escape new lines
    .replace(/'/g, "\\'"); // escape quotes

const testCode = jsCode => {
  // test if code exceeds maxLines
  if (state.codeChecks.maxLines < jsCode.trim().split('\n').length) {
    fail(
      `You must complete this exercise with ${
        state.codeChecks.maxLines
      } lines of JavaScript or less.`,
    );
  }

  // test if code contains certain strings
  state.codeChecks.has.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (!re.test(jsCode)) {
      fail(piece.message);
    }
  });

  // test if code does not contain certain strings
  state.codeChecks.hasNot.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (re.test(jsCode)) {
      fail(piece.message);
    }
  });

  if (state.errorCount === 0) {
    log(
      `<span class="text-success">
        <i class="fas fa-check-circle"></i> Yay! All tests passed!
      </span>`,
    );
  }
};

// run the user's code against some tests
const runCode = editors => {
  state.errorCount = 0;

  $('#console-output').empty();

  const htmlCode = editors.html.getValue();
  const jsCode = escapeCode(transform(editors.js.getValue()));
  const scriptToRun = `
    {
      ${state.secret}
    }
    {
      ${state.codeChecks.setup}
      {
        try {
          eval('${jsCode}');
        } catch (e) {
          fail(e);
        }
      }
      ${state.codeChecks.run}
      ${state.codeChecks.cleanup}
    }`;

  writeToFrame(`
    ${htmlCode}
    <script>
      {
        const fail = window.parent.fail;
        console.log = window.parent.log;
        ${scriptToRun}
      }
    </script>`);

  testCode(jsCode);

  // show error count on the footer
  $('#error-count-container').html(
    `<span class="${state.errorCount ? 'text-danger' : ''}">
      <i class="fas fa-times-circle"></i> ${state.errorCount} Errors
    </span>`,
  );

  // warn user about errors in modal
  if (state.errorCount) {
    $('#modal-body-optional-info').html(
      `You currently have ${state.errorCount} errors in your JavaScript code!`,
    );
  } else {
    $('#modal-body-optional-info').empty();
  }
};

const setState = newState => {
  state = { ...state, ...newState };
};

const getState = () => state;

window.fail = fail;
window.log = log;


/***/ }),

/***/ "./jstutorials/editor_src/coinsHandler.js":
/*!************************************************!*\
  !*** ./jstutorials/editor_src/coinsHandler.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* global $ */

if (localStorage.getItem('usedHint') == null) {
  localStorage.setItem('usedHint', false);
}

fetch(`/static/mock_data/user.json`)
  .then(data => data.json())
  .then(data => {
    const updateCoinCount = () => {
      const usedHint = localStorage.getItem('usedHint') === 'true';
      $('#coin-count-container').html(
        `<i class="fas fa-coins"></i> ${data.coins - usedHint} Coins`,
      );
    };

    updateCoinCount();

    $('#use-hint-button').click(() => {
      $('#hintModal').modal('show');
      localStorage.setItem('usedHint', true);
      updateCoinCount();
    });
  });

$('#ask-for-hint-button').click(() => {
  const usedHint = localStorage.getItem('usedHint') === 'true';
  $(usedHint ? '#hintModal' : '#hintPrompt').modal('show');
});


/***/ }),

/***/ "./jstutorials/editor_src/index.js":
/*!*****************************************!*\
  !*** ./jstutorials/editor_src/index.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _coinsHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coinsHandler.js */ "./jstutorials/editor_src/coinsHandler.js");
/* harmony import */ var _coinsHandler_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_coinsHandler_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _splitHandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./splitHandler.js */ "./jstutorials/editor_src/splitHandler.js");
/* harmony import */ var _splitHandler_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_splitHandler_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _codeEditor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codeEditor.js */ "./jstutorials/editor_src/codeEditor.js");
/* global $ */





const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);


/***/ }),

/***/ "./jstutorials/editor_src/splitHandler.js":
/*!************************************************!*\
  !*** ./jstutorials/editor_src/splitHandler.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* global $, Split */

const constants = {
  // the percentage view for the console to be considered closed
  consoleClosedThreshold: 97.5,
  consoleDefaultSplitSize: [60, 40],
  gutterSize: 8,
};

const state = {
  // save split size between html view and console
  consoleSplitSize: constants.consoleDefaultSplitSize,
  // console pane visible state
  consoleShowned: true,
};

// make editors and code output resizable
const splits = {
  left: Split(['#html-editor-parent', '#js-editor-parent'], {
    direction: 'vertical',
    gutterSize: constants.gutterSize,
  }),
  right: Split(['#html-frame-view', '#console-area'], {
    direction: 'vertical',
    gutterSize: constants.gutterSize,
    sizes: state.consoleSplitSize,
    minSize: 0,
    onDrag() {
      state.consoleSplitSize = splits.right.getSizes();
      state.consoleShowned =
        state.consoleSplitSize[0] < constants.consoleClosedThreshold;
    },
  }),
  cols: Split(['#editors', '#code-output'], {
    gutterSize: constants.gutterSize,
  }),
};

$('#toggle-console-button').click(() => {
  $(this).toggleClass('active');

  // if the console is visible, make hidden
  // else, restore the previous size
  if (state.consoleShowned) {
    splits.right.setSizes([100, 0]);
  } else if (state.consoleSplitSize[0] < constants.consoleClosedThreshold) {
    splits.right.setSizes(state.consoleSplitSize);
  } else {
    splits.right.setSizes(constants.consoleDefaultSplitSize);
  }

  state.consoleShowned = !state.consoleShowned;
});


/***/ }),

/***/ "./node_modules/loop-protect/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/loop-protect/dist/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var generateBefore = function generateBefore(t, id) {
  return t.variableDeclaration('var', [t.variableDeclarator(id, t.callExpression(t.memberExpression(t.identifier('Date'), t.identifier('now')), []))]);
};

var generateInside = function generateInside() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      t = _ref.t,
      id = _ref.id,
      line = _ref.line,
      ch = _ref.ch,
      timeout = _ref.timeout,
      extra = _ref.extra;

  return t.ifStatement(t.binaryExpression('>', t.binaryExpression('-', t.callExpression(t.memberExpression(t.identifier('Date'), t.identifier('now')), []), id), t.numericLiteral(timeout)), extra ? t.blockStatement([t.expressionStatement(t.callExpression(extra, [t.numericLiteral(line), t.numericLiteral(ch)])), t.breakStatement()]) : t.breakStatement());
};

var protect = function protect(t, timeout, extra) {
  return function (path) {
    if (!path.node.loc) {
      // I don't really know _how_ we get into this state
      // but https://jsbin.com/mipesawapi/1/ triggers it
      // and the node, I'm guessing after translation,
      // doesn't have a line in the code, so this blows up.
      return;
    }
    var id = path.scope.generateUidIdentifier('LP');
    var before = generateBefore(t, id);
    var inside = generateInside({
      t: t,
      id: id,
      line: path.node.loc.start.line,
      ch: path.node.loc.start.column,
      timeout: timeout,
      extra: extra
    });
    var body = path.get('body');

    // if we have an expression statement, convert it to a block
    if (t.isExpressionStatement(body)) {
      body.replaceWith(t.blockStatement([body.node]));
    }
    path.insertBefore(before);
    body.unshiftContainer('body', inside);
  };
};

module.exports = function () {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (typeof extra === 'string') {
    var string = extra;
    extra = '() => console.error("' + string.replace(/"/g, '\\"') + '")';
  } else if (extra !== null) {
    extra = extra.toString();
    if (extra.startsWith('function (')) {
      // fix anonymous functions as they'll cause
      // the callback transform to blow up
      extra = extra.replace(/^function \(/, 'function callback(');
    }
  }

  return function (_ref2) {
    var t = _ref2.types,
        transform = _ref2.transform;

    var node = extra ? transform(extra).ast.program.body[0] : null;

    var callback = null;
    if (t.isExpressionStatement(node)) {
      callback = node.expression;
    } else if (t.isFunctionDeclaration(node)) {
      callback = t.functionExpression(null, node.params, node.body);
    }

    return {
      visitor: {
        WhileStatement: protect(t, timeout, callback),
        ForStatement: protect(t, timeout, callback),
        DoWhileStatement: protect(t, timeout, callback)
      }
    };
  };
};

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vanN0dXRvcmlhbHMvZWRpdG9yX3NyYy9jb2RlRWRpdG9yLmpzIiwid2VicGFjazovLy8uL2pzdHV0b3JpYWxzL2VkaXRvcl9zcmMvY29kZVJ1bm5lci5qcyIsIndlYnBhY2s6Ly8vLi9qc3R1dG9yaWFscy9lZGl0b3Jfc3JjL2NvaW5zSGFuZGxlci5qcyIsIndlYnBhY2s6Ly8vLi9qc3R1dG9yaWFscy9lZGl0b3Jfc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL2pzdHV0b3JpYWxzL2VkaXRvcl9zcmMvc3BsaXRIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb29wLXByb3RlY3QvZGlzdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTs7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDcERZOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1GQUFtRjtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRSIsImZpbGUiOiJjb2RlX2VkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vanN0dXRvcmlhbHMvZWRpdG9yX3NyYy9pbmRleC5qc1wiKTtcbiIsIi8qIGdsb2JhbCAkLCBDb2RlTWlycm9yLCBqc3lhbWwgKi9cblxuaW1wb3J0IHsgcnVuQ29kZSwgc2V0U3RhdGUsIGdldFN0YXRlIH0gZnJvbSAnLi9jb2RlUnVubmVyLmpzJztcblxuY29uc3Qgc2hhcmVkQ29uZmlnID0ge1xuICBhdXRvQ2xvc2VCcmFja2V0czogdHJ1ZSxcbiAgZXh0cmFLZXlzOiB7XG4gICAgVGFiOiAnaW5zZXJ0U29mdFRhYicsXG4gIH0sXG4gIGd1dHRlcnM6IFsnQ29kZU1pcnJvci1saW50LW1hcmtlcnMnXSxcbiAgbGluZU51bWJlcnM6IHRydWUsXG4gIHNjcm9sbGJhclN0eWxlOiAnc2ltcGxlJyxcbiAgc2Nyb2xsUGFzdEVuZDogdHJ1ZSxcbiAgdGFiU2l6ZTogMixcbiAgdGhlbWU6ICduZW8nLFxufTtcblxuLy8gY3JlYXRlIGNvZGVtaXJyb3IgaW5zdGFuY2VzLlxuY29uc3QgZWRpdG9ycyA9IHtcbiAgaHRtbDogQ29kZU1pcnJvcigkKCcjaHRtbC1lZGl0b3InKVswXSwge1xuICAgIC4uLnNoYXJlZENvbmZpZyxcbiAgICBtb2RlOiAnaHRtbG1peGVkJyxcbiAgICBhdXRvQ2xvc2VUYWdzOiB0cnVlLFxuICAgIGxpbnQ6IHRydWUsXG4gIH0pLFxuICBqczogQ29kZU1pcnJvcigkKCcjanMtZWRpdG9yJylbMF0sIHtcbiAgICAuLi5zaGFyZWRDb25maWcsXG4gICAgbW9kZTogJ2phdmFzY3JpcHQnLFxuICAgIGxpbnQ6IHtcbiAgICAgIGVzdmVyc2lvbjogNixcbiAgICB9LFxuICB9KSxcbn07XG5cbmVkaXRvcnMuanMub24oJ2NoYW5nZScsICgpID0+IHJ1bkNvZGUoZWRpdG9ycykpO1xuXG5mZXRjaCgnL3N0YXRpYy9tb2NrX2RhdGEvZXhlcmNpc2VfY2FudmFzLnltbCcpXG4gIC50aGVuKGRhdGEgPT4gZGF0YS50ZXh0KCkpXG4gIC50aGVuKGpzeWFtbC5sb2FkKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBzZXRTdGF0ZSh7IHNlY3JldDogZGF0YS5zZWNyZXQsIGNvZGVDaGVja3M6IGRhdGEudGVzdCB9KTtcblxuICAgICQoJyNzdWJtaXQtYnV0dG9uJykuY2xpY2soKCkgPT4ge1xuICAgICAgY29uc3QgeyBlcnJvckNvdW50IH0gPSBnZXRTdGF0ZSgpO1xuICAgICAgY29uc3QgdGhyZXNob2xkID0gZGF0YS50ZXN0LmVycm9yVGhyZXNob2xkO1xuICAgICAgY29uc3Qgc3VibWl0RGF0YSA9IHtcbiAgICAgICAgZXJyb3JDb3VudCxcbiAgICAgICAgZ3JhZGU6IE1hdGgubWF4KCh0aHJlc2hvbGQgLSBlcnJvckNvdW50KSwgMCkgLyB0aHJlc2hvbGQsXG4gICAgICAgIHVzZWRIaW50OiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlZEhpbnQnKSA9PT0gJ3RydWUnLFxuICAgICAgfTtcblxuICAgICAgY29uc29sZS5sb2coc3VibWl0RGF0YSk7XG4gICAgfSk7XG5cbiAgICAvLyBpbnNlcnQgZGF0YSB0byB0aGUgcGFnZVxuICAgICQoJyN0YXNrLXBsYWNlaG9sZGVyJykuaHRtbChkYXRhLnRhc2spO1xuICAgICQoJyNoaW50LWJvZHknKS5odG1sKGRhdGEuaGludCk7XG4gICAgZWRpdG9ycy5odG1sLnNldFZhbHVlKGRhdGEuaHRtbCk7XG4gICAgZWRpdG9ycy5qcy5zZXRWYWx1ZShkYXRhLmpzKTtcblxuICAgIHJ1bkNvZGUoZWRpdG9ycyk7XG4gIH0pO1xuIiwiLyogZ2xvYmFsICQsIEJhYmVsICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmltcG9ydCBwcm90ZWN0IGZyb20gJ2xvb3AtcHJvdGVjdCc7XG5cbmxldCBzdGF0ZSA9IHtcbiAgLy8gc2VjcmV0IGphdmFzY3JpcHQgY29kZSBub3Qgc2hvd24gdG8gdGhlIHVzZXJcbiAgc2VjcmV0OiAnJyxcbiAgLy8gYSB0ZXN0aW5nICdzdWl0ZScgcmFuIGFnYWluc3QgdXNlciBjb2RlXG4gIGNvZGVDaGVja3M6IHtcbiAgICBzZXR1cDogJycsIC8vIHJ1biBiZWZvcmUgdXNlciBjb2RlXG4gICAgcnVuOiAnJywgLy8gcnVuIGFmdGVyIHVzZXIgY29kZVxuICAgIGNsZWFudXA6ICcnLCAvLyBydW5zIGxhc3RcbiAgICBoYXM6IFtdLCAvLyBjaGVja3MgaWYgY29kZSBjb250YWlucyBhIHBhdHRlcm5cbiAgICBoYXNOb3Q6IFtdLCAvLyBvcHBvc2l0ZSBvZiAnaGFzJ1xuICAgIG1heExpbmVzOiAyMDAsIC8vIG1heCBudW1iZXIgb2YgbGluZXMgdXNlciBzaG91bGQgY29kZVxuICAgIGVycm9yVGhyZXNob2xkOiAwLCAvLyAoZXJyb3JUaHJlc2hvbGQgLSBlcnJvckNvdW50KSAvIGVycm9yVGhyZXNob2xkID0gZ3JhZGVcbiAgfSxcbiAgZXJyb3JDb3VudDogMCxcbn07XG5cbmV4cG9ydCBjb25zdCBsb2cgPSB4ID0+IHtcbiAgJCgnI2NvbnNvbGUtb3V0cHV0JykuYXBwZW5kKGA8c2FtcD4ke3h9PC9zYW1wPjxiciAvPmApO1xuICBjb25zb2xlLmxvZyh4KTtcbn07XG5cbmV4cG9ydCBjb25zdCBmYWlsID0geCA9PiB7XG4gIHN0YXRlLmVycm9yQ291bnQrKztcbiAgJCgnI2NvbnNvbGUtb3V0cHV0JykuYXBwZW5kKFxuICAgIGA8Y29kZT48aSBjbGFzcz1cImZhcyBmYS10aW1lcy1jaXJjbGVcIj48L2k+ICR7eH08L2NvZGU+PGJyIC8+YCxcbiAgKTtcbiAgY29uc29sZS5lcnJvcih4KTtcbn07XG5cbkJhYmVsLnJlZ2lzdGVyUGx1Z2luKCdsb29wUHJvdGVjdGlvbicsIHByb3RlY3QoMjAwLCBsaW5lID0+IHtcbiAgY29uc3QgZXJyID0gbmV3IEVycm9yKGBQb3NzaWJsZSBpbmZpbml0ZSBsb29wIG9uIGxpbmUgJHtsaW5lfWApO1xuICB0aHJvdyBlcnI7XG59KSk7XG5cbmNvbnN0IHRyYW5zZm9ybSA9IHNvdXJjZSA9PiBCYWJlbC50cmFuc2Zvcm0oc291cmNlLCB7XG4gIHBsdWdpbnM6IFsnbG9vcFByb3RlY3Rpb24nXSxcbn0pLmNvZGU7XG5cbndpbmRvdy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cbi8vIHdyaXRlIGNvZGUgdG8gdGhlIGlmcmFtZVxuY29uc3Qgd3JpdGVUb0ZyYW1lID0gY29kZSA9PiB7XG4gIGNvbnN0IGlmcmFtZURvY3VtZW50ID0gJCgnaWZyYW1lJylbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudDtcblxuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGNvZGUpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xufTtcblxuY29uc3QgZXNjYXBlQ29kZSA9IHN0ciA9PlxuICBzdHJcbiAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSAvLyBwcmVzZXJ2ZSBiYWNrc2xhc2hcbiAgICAucmVwbGFjZSgvW1xcblxccl0vZywgJ1xcXFxuJykgLy8gZXNjYXBlIG5ldyBsaW5lc1xuICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIik7IC8vIGVzY2FwZSBxdW90ZXNcblxuY29uc3QgdGVzdENvZGUgPSBqc0NvZGUgPT4ge1xuICAvLyB0ZXN0IGlmIGNvZGUgZXhjZWVkcyBtYXhMaW5lc1xuICBpZiAoc3RhdGUuY29kZUNoZWNrcy5tYXhMaW5lcyA8IGpzQ29kZS50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aCkge1xuICAgIGZhaWwoXG4gICAgICBgWW91IG11c3QgY29tcGxldGUgdGhpcyBleGVyY2lzZSB3aXRoICR7XG4gICAgICAgIHN0YXRlLmNvZGVDaGVja3MubWF4TGluZXNcbiAgICAgIH0gbGluZXMgb2YgSmF2YVNjcmlwdCBvciBsZXNzLmAsXG4gICAgKTtcbiAgfVxuXG4gIC8vIHRlc3QgaWYgY29kZSBjb250YWlucyBjZXJ0YWluIHN0cmluZ3NcbiAgc3RhdGUuY29kZUNoZWNrcy5oYXMuZm9yRWFjaChwaWVjZSA9PiB7XG4gICAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKHBpZWNlLnJlZ2V4KTtcblxuICAgIGlmICghcmUudGVzdChqc0NvZGUpKSB7XG4gICAgICBmYWlsKHBpZWNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gdGVzdCBpZiBjb2RlIGRvZXMgbm90IGNvbnRhaW4gY2VydGFpbiBzdHJpbmdzXG4gIHN0YXRlLmNvZGVDaGVja3MuaGFzTm90LmZvckVhY2gocGllY2UgPT4ge1xuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChwaWVjZS5yZWdleCk7XG5cbiAgICBpZiAocmUudGVzdChqc0NvZGUpKSB7XG4gICAgICBmYWlsKHBpZWNlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHN0YXRlLmVycm9yQ291bnQgPT09IDApIHtcbiAgICBsb2coXG4gICAgICBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2stY2lyY2xlXCI+PC9pPiBZYXkhIEFsbCB0ZXN0cyBwYXNzZWQhXG4gICAgICA8L3NwYW4+YCxcbiAgICApO1xuICB9XG59O1xuXG4vLyBydW4gdGhlIHVzZXIncyBjb2RlIGFnYWluc3Qgc29tZSB0ZXN0c1xuZXhwb3J0IGNvbnN0IHJ1bkNvZGUgPSBlZGl0b3JzID0+IHtcbiAgc3RhdGUuZXJyb3JDb3VudCA9IDA7XG5cbiAgJCgnI2NvbnNvbGUtb3V0cHV0JykuZW1wdHkoKTtcblxuICBjb25zdCBodG1sQ29kZSA9IGVkaXRvcnMuaHRtbC5nZXRWYWx1ZSgpO1xuICBjb25zdCBqc0NvZGUgPSBlc2NhcGVDb2RlKHRyYW5zZm9ybShlZGl0b3JzLmpzLmdldFZhbHVlKCkpKTtcbiAgY29uc3Qgc2NyaXB0VG9SdW4gPSBgXG4gICAge1xuICAgICAgJHtzdGF0ZS5zZWNyZXR9XG4gICAgfVxuICAgIHtcbiAgICAgICR7c3RhdGUuY29kZUNoZWNrcy5zZXR1cH1cbiAgICAgIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBldmFsKCcke2pzQ29kZX0nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGZhaWwoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICR7c3RhdGUuY29kZUNoZWNrcy5ydW59XG4gICAgICAke3N0YXRlLmNvZGVDaGVja3MuY2xlYW51cH1cbiAgICB9YDtcblxuICB3cml0ZVRvRnJhbWUoYFxuICAgICR7aHRtbENvZGV9XG4gICAgPHNjcmlwdD5cbiAgICAgIHtcbiAgICAgICAgY29uc3QgZmFpbCA9IHdpbmRvdy5wYXJlbnQuZmFpbDtcbiAgICAgICAgY29uc29sZS5sb2cgPSB3aW5kb3cucGFyZW50LmxvZztcbiAgICAgICAgJHtzY3JpcHRUb1J1bn1cbiAgICAgIH1cbiAgICA8L3NjcmlwdD5gKTtcblxuICB0ZXN0Q29kZShqc0NvZGUpO1xuXG4gIC8vIHNob3cgZXJyb3IgY291bnQgb24gdGhlIGZvb3RlclxuICAkKCcjZXJyb3ItY291bnQtY29udGFpbmVyJykuaHRtbChcbiAgICBgPHNwYW4gY2xhc3M9XCIke3N0YXRlLmVycm9yQ291bnQgPyAndGV4dC1kYW5nZXInIDogJyd9XCI+XG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS10aW1lcy1jaXJjbGVcIj48L2k+ICR7c3RhdGUuZXJyb3JDb3VudH0gRXJyb3JzXG4gICAgPC9zcGFuPmAsXG4gICk7XG5cbiAgLy8gd2FybiB1c2VyIGFib3V0IGVycm9ycyBpbiBtb2RhbFxuICBpZiAoc3RhdGUuZXJyb3JDb3VudCkge1xuICAgICQoJyNtb2RhbC1ib2R5LW9wdGlvbmFsLWluZm8nKS5odG1sKFxuICAgICAgYFlvdSBjdXJyZW50bHkgaGF2ZSAke3N0YXRlLmVycm9yQ291bnR9IGVycm9ycyBpbiB5b3VyIEphdmFTY3JpcHQgY29kZSFgLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgJCgnI21vZGFsLWJvZHktb3B0aW9uYWwtaW5mbycpLmVtcHR5KCk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZXRTdGF0ZSA9IG5ld1N0YXRlID0+IHtcbiAgc3RhdGUgPSB7IC4uLnN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFN0YXRlID0gKCkgPT4gc3RhdGU7XG5cbndpbmRvdy5mYWlsID0gZmFpbDtcbndpbmRvdy5sb2cgPSBsb2c7XG4iLCIvKiBnbG9iYWwgJCAqL1xuXG5pZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZWRIaW50JykgPT0gbnVsbCkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlZEhpbnQnLCBmYWxzZSk7XG59XG5cbmZldGNoKGAvc3RhdGljL21vY2tfZGF0YS91c2VyLmpzb25gKVxuICAudGhlbihkYXRhID0+IGRhdGEuanNvbigpKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBjb25zdCB1cGRhdGVDb2luQ291bnQgPSAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VkSGludCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VkSGludCcpID09PSAndHJ1ZSc7XG4gICAgICAkKCcjY29pbi1jb3VudC1jb250YWluZXInKS5odG1sKFxuICAgICAgICBgPGkgY2xhc3M9XCJmYXMgZmEtY29pbnNcIj48L2k+ICR7ZGF0YS5jb2lucyAtIHVzZWRIaW50fSBDb2luc2AsXG4gICAgICApO1xuICAgIH07XG5cbiAgICB1cGRhdGVDb2luQ291bnQoKTtcblxuICAgICQoJyN1c2UtaGludC1idXR0b24nKS5jbGljaygoKSA9PiB7XG4gICAgICAkKCcjaGludE1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VkSGludCcsIHRydWUpO1xuICAgICAgdXBkYXRlQ29pbkNvdW50KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4kKCcjYXNrLWZvci1oaW50LWJ1dHRvbicpLmNsaWNrKCgpID0+IHtcbiAgY29uc3QgdXNlZEhpbnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlZEhpbnQnKSA9PT0gJ3RydWUnO1xuICAkKHVzZWRIaW50ID8gJyNoaW50TW9kYWwnIDogJyNoaW50UHJvbXB0JykubW9kYWwoJ3Nob3cnKTtcbn0pO1xuIiwiLyogZ2xvYmFsICQgKi9cblxuaW1wb3J0ICcuL2NvaW5zSGFuZGxlci5qcyc7XG5pbXBvcnQgJy4vc3BsaXRIYW5kbGVyLmpzJztcbmltcG9ydCAnLi9jb2RlRWRpdG9yLmpzJztcblxuY29uc3QgdXBkYXRlUGFnZUhlaWdodCA9ICgpID0+XG4gICQoJyNjb2RlLS1wYWdlLWNvbnRhaW5lcicpLmhlaWdodChcbiAgICAkKHdpbmRvdykuaGVpZ2h0KCkgLSAkKCcjbmF2YmFyLWNvbXBvbmVudCcpLmhlaWdodCgpLFxuICApO1xudXBkYXRlUGFnZUhlaWdodCgpO1xuJCh3aW5kb3cpLnJlc2l6ZSh1cGRhdGVQYWdlSGVpZ2h0KTtcbiIsIi8qIGdsb2JhbCAkLCBTcGxpdCAqL1xuXG5jb25zdCBjb25zdGFudHMgPSB7XG4gIC8vIHRoZSBwZXJjZW50YWdlIHZpZXcgZm9yIHRoZSBjb25zb2xlIHRvIGJlIGNvbnNpZGVyZWQgY2xvc2VkXG4gIGNvbnNvbGVDbG9zZWRUaHJlc2hvbGQ6IDk3LjUsXG4gIGNvbnNvbGVEZWZhdWx0U3BsaXRTaXplOiBbNjAsIDQwXSxcbiAgZ3V0dGVyU2l6ZTogOCxcbn07XG5cbmNvbnN0IHN0YXRlID0ge1xuICAvLyBzYXZlIHNwbGl0IHNpemUgYmV0d2VlbiBodG1sIHZpZXcgYW5kIGNvbnNvbGVcbiAgY29uc29sZVNwbGl0U2l6ZTogY29uc3RhbnRzLmNvbnNvbGVEZWZhdWx0U3BsaXRTaXplLFxuICAvLyBjb25zb2xlIHBhbmUgdmlzaWJsZSBzdGF0ZVxuICBjb25zb2xlU2hvd25lZDogdHJ1ZSxcbn07XG5cbi8vIG1ha2UgZWRpdG9ycyBhbmQgY29kZSBvdXRwdXQgcmVzaXphYmxlXG5jb25zdCBzcGxpdHMgPSB7XG4gIGxlZnQ6IFNwbGl0KFsnI2h0bWwtZWRpdG9yLXBhcmVudCcsICcjanMtZWRpdG9yLXBhcmVudCddLCB7XG4gICAgZGlyZWN0aW9uOiAndmVydGljYWwnLFxuICAgIGd1dHRlclNpemU6IGNvbnN0YW50cy5ndXR0ZXJTaXplLFxuICB9KSxcbiAgcmlnaHQ6IFNwbGl0KFsnI2h0bWwtZnJhbWUtdmlldycsICcjY29uc29sZS1hcmVhJ10sIHtcbiAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXG4gICAgZ3V0dGVyU2l6ZTogY29uc3RhbnRzLmd1dHRlclNpemUsXG4gICAgc2l6ZXM6IHN0YXRlLmNvbnNvbGVTcGxpdFNpemUsXG4gICAgbWluU2l6ZTogMCxcbiAgICBvbkRyYWcoKSB7XG4gICAgICBzdGF0ZS5jb25zb2xlU3BsaXRTaXplID0gc3BsaXRzLnJpZ2h0LmdldFNpemVzKCk7XG4gICAgICBzdGF0ZS5jb25zb2xlU2hvd25lZCA9XG4gICAgICAgIHN0YXRlLmNvbnNvbGVTcGxpdFNpemVbMF0gPCBjb25zdGFudHMuY29uc29sZUNsb3NlZFRocmVzaG9sZDtcbiAgICB9LFxuICB9KSxcbiAgY29sczogU3BsaXQoWycjZWRpdG9ycycsICcjY29kZS1vdXRwdXQnXSwge1xuICAgIGd1dHRlclNpemU6IGNvbnN0YW50cy5ndXR0ZXJTaXplLFxuICB9KSxcbn07XG5cbiQoJyN0b2dnbGUtY29uc29sZS1idXR0b24nKS5jbGljaygoKSA9PiB7XG4gICQodGhpcykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gIC8vIGlmIHRoZSBjb25zb2xlIGlzIHZpc2libGUsIG1ha2UgaGlkZGVuXG4gIC8vIGVsc2UsIHJlc3RvcmUgdGhlIHByZXZpb3VzIHNpemVcbiAgaWYgKHN0YXRlLmNvbnNvbGVTaG93bmVkKSB7XG4gICAgc3BsaXRzLnJpZ2h0LnNldFNpemVzKFsxMDAsIDBdKTtcbiAgfSBlbHNlIGlmIChzdGF0ZS5jb25zb2xlU3BsaXRTaXplWzBdIDwgY29uc3RhbnRzLmNvbnNvbGVDbG9zZWRUaHJlc2hvbGQpIHtcbiAgICBzcGxpdHMucmlnaHQuc2V0U2l6ZXMoc3RhdGUuY29uc29sZVNwbGl0U2l6ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaXRzLnJpZ2h0LnNldFNpemVzKGNvbnN0YW50cy5jb25zb2xlRGVmYXVsdFNwbGl0U2l6ZSk7XG4gIH1cblxuICBzdGF0ZS5jb25zb2xlU2hvd25lZCA9ICFzdGF0ZS5jb25zb2xlU2hvd25lZDtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2VuZXJhdGVCZWZvcmUgPSBmdW5jdGlvbiBnZW5lcmF0ZUJlZm9yZSh0LCBpZCkge1xuICByZXR1cm4gdC52YXJpYWJsZURlY2xhcmF0aW9uKCd2YXInLCBbdC52YXJpYWJsZURlY2xhcmF0b3IoaWQsIHQuY2FsbEV4cHJlc3Npb24odC5tZW1iZXJFeHByZXNzaW9uKHQuaWRlbnRpZmllcignRGF0ZScpLCB0LmlkZW50aWZpZXIoJ25vdycpKSwgW10pKV0pO1xufTtcblxudmFyIGdlbmVyYXRlSW5zaWRlID0gZnVuY3Rpb24gZ2VuZXJhdGVJbnNpZGUoKSB7XG4gIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fSxcbiAgICAgIHQgPSBfcmVmLnQsXG4gICAgICBpZCA9IF9yZWYuaWQsXG4gICAgICBsaW5lID0gX3JlZi5saW5lLFxuICAgICAgY2ggPSBfcmVmLmNoLFxuICAgICAgdGltZW91dCA9IF9yZWYudGltZW91dCxcbiAgICAgIGV4dHJhID0gX3JlZi5leHRyYTtcblxuICByZXR1cm4gdC5pZlN0YXRlbWVudCh0LmJpbmFyeUV4cHJlc3Npb24oJz4nLCB0LmJpbmFyeUV4cHJlc3Npb24oJy0nLCB0LmNhbGxFeHByZXNzaW9uKHQubWVtYmVyRXhwcmVzc2lvbih0LmlkZW50aWZpZXIoJ0RhdGUnKSwgdC5pZGVudGlmaWVyKCdub3cnKSksIFtdKSwgaWQpLCB0Lm51bWVyaWNMaXRlcmFsKHRpbWVvdXQpKSwgZXh0cmEgPyB0LmJsb2NrU3RhdGVtZW50KFt0LmV4cHJlc3Npb25TdGF0ZW1lbnQodC5jYWxsRXhwcmVzc2lvbihleHRyYSwgW3QubnVtZXJpY0xpdGVyYWwobGluZSksIHQubnVtZXJpY0xpdGVyYWwoY2gpXSkpLCB0LmJyZWFrU3RhdGVtZW50KCldKSA6IHQuYnJlYWtTdGF0ZW1lbnQoKSk7XG59O1xuXG52YXIgcHJvdGVjdCA9IGZ1bmN0aW9uIHByb3RlY3QodCwgdGltZW91dCwgZXh0cmEpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgaWYgKCFwYXRoLm5vZGUubG9jKSB7XG4gICAgICAvLyBJIGRvbid0IHJlYWxseSBrbm93IF9ob3dfIHdlIGdldCBpbnRvIHRoaXMgc3RhdGVcbiAgICAgIC8vIGJ1dCBodHRwczovL2pzYmluLmNvbS9taXBlc2F3YXBpLzEvIHRyaWdnZXJzIGl0XG4gICAgICAvLyBhbmQgdGhlIG5vZGUsIEknbSBndWVzc2luZyBhZnRlciB0cmFuc2xhdGlvbixcbiAgICAgIC8vIGRvZXNuJ3QgaGF2ZSBhIGxpbmUgaW4gdGhlIGNvZGUsIHNvIHRoaXMgYmxvd3MgdXAuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBpZCA9IHBhdGguc2NvcGUuZ2VuZXJhdGVVaWRJZGVudGlmaWVyKCdMUCcpO1xuICAgIHZhciBiZWZvcmUgPSBnZW5lcmF0ZUJlZm9yZSh0LCBpZCk7XG4gICAgdmFyIGluc2lkZSA9IGdlbmVyYXRlSW5zaWRlKHtcbiAgICAgIHQ6IHQsXG4gICAgICBpZDogaWQsXG4gICAgICBsaW5lOiBwYXRoLm5vZGUubG9jLnN0YXJ0LmxpbmUsXG4gICAgICBjaDogcGF0aC5ub2RlLmxvYy5zdGFydC5jb2x1bW4sXG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgZXh0cmE6IGV4dHJhXG4gICAgfSk7XG4gICAgdmFyIGJvZHkgPSBwYXRoLmdldCgnYm9keScpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhbiBleHByZXNzaW9uIHN0YXRlbWVudCwgY29udmVydCBpdCB0byBhIGJsb2NrXG4gICAgaWYgKHQuaXNFeHByZXNzaW9uU3RhdGVtZW50KGJvZHkpKSB7XG4gICAgICBib2R5LnJlcGxhY2VXaXRoKHQuYmxvY2tTdGF0ZW1lbnQoW2JvZHkubm9kZV0pKTtcbiAgICB9XG4gICAgcGF0aC5pbnNlcnRCZWZvcmUoYmVmb3JlKTtcbiAgICBib2R5LnVuc2hpZnRDb250YWluZXIoJ2JvZHknLCBpbnNpZGUpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aW1lb3V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAxMDA7XG4gIHZhciBleHRyYSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICBpZiAodHlwZW9mIGV4dHJhID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzdHJpbmcgPSBleHRyYTtcbiAgICBleHRyYSA9ICcoKSA9PiBjb25zb2xlLmVycm9yKFwiJyArIHN0cmluZy5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCIpJztcbiAgfSBlbHNlIGlmIChleHRyYSAhPT0gbnVsbCkge1xuICAgIGV4dHJhID0gZXh0cmEudG9TdHJpbmcoKTtcbiAgICBpZiAoZXh0cmEuc3RhcnRzV2l0aCgnZnVuY3Rpb24gKCcpKSB7XG4gICAgICAvLyBmaXggYW5vbnltb3VzIGZ1bmN0aW9ucyBhcyB0aGV5J2xsIGNhdXNlXG4gICAgICAvLyB0aGUgY2FsbGJhY2sgdHJhbnNmb3JtIHRvIGJsb3cgdXBcbiAgICAgIGV4dHJhID0gZXh0cmEucmVwbGFjZSgvXmZ1bmN0aW9uIFxcKC8sICdmdW5jdGlvbiBjYWxsYmFjaygnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgdmFyIHQgPSBfcmVmMi50eXBlcyxcbiAgICAgICAgdHJhbnNmb3JtID0gX3JlZjIudHJhbnNmb3JtO1xuXG4gICAgdmFyIG5vZGUgPSBleHRyYSA/IHRyYW5zZm9ybShleHRyYSkuYXN0LnByb2dyYW0uYm9keVswXSA6IG51bGw7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSBudWxsO1xuICAgIGlmICh0LmlzRXhwcmVzc2lvblN0YXRlbWVudChub2RlKSkge1xuICAgICAgY2FsbGJhY2sgPSBub2RlLmV4cHJlc3Npb247XG4gICAgfSBlbHNlIGlmICh0LmlzRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgY2FsbGJhY2sgPSB0LmZ1bmN0aW9uRXhwcmVzc2lvbihudWxsLCBub2RlLnBhcmFtcywgbm9kZS5ib2R5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmlzaXRvcjoge1xuICAgICAgICBXaGlsZVN0YXRlbWVudDogcHJvdGVjdCh0LCB0aW1lb3V0LCBjYWxsYmFjayksXG4gICAgICAgIEZvclN0YXRlbWVudDogcHJvdGVjdCh0LCB0aW1lb3V0LCBjYWxsYmFjayksXG4gICAgICAgIERvV2hpbGVTdGF0ZW1lbnQ6IHByb3RlY3QodCwgdGltZW91dCwgY2FsbGJhY2spXG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn07Il0sInNvdXJjZVJvb3QiOiIifQ==