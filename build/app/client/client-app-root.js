"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
const ClientAppRoot = (...props) => {
    return (React.createElement("form", { action: "/auth/login", method: "POST" },
        React.createElement("div", null, "Username:"),
        React.createElement("input", { type: "text", name: "username" }),
        React.createElement("div", null, "Password:"),
        React.createElement("input", { type: "text", name: "password" }),
        React.createElement("div", null,
            React.createElement("input", { type: "submit", value: "Submit" }))));
};
ReactDOM.render(ClientAppRoot('appState', 'en'), document.getElementById('app'));
//# sourceMappingURL=client-app-root.js.map