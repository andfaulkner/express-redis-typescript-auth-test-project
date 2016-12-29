webpackJsonp([1,2],{

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(32);

var React = _interopRequireWildcard(_react);

var _reactDom = __webpack_require__(31);

var ReactDOM = _interopRequireWildcard(_reactDom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ClientAppRoot = function ClientAppRoot() {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    return React.createElement("form", { action: "/auth/login", method: "POST" }, React.createElement("div", null, "Username:"), React.createElement("input", { type: "text", name: "username" }), React.createElement("div", null, "Password:"), React.createElement("input", { type: "text", name: "password" }), React.createElement("div", null, React.createElement("input", { type: "submit", value: "Submit" })));
};
ReactDOM.render(ClientAppRoot('appState', 'en'), document.getElementById('app'));

/***/ }

},[179]);