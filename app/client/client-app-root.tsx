import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ClientAppRootProps { }

const ClientAppRoot = (...props) => {
    return (
        <form action="/auth/login" method="POST">
            <div>
                Username:
            </div>
            <input type="text" name="username"></input>
            <div>
                Password:
            </div>
            <input type="text" name="password"></input>
            <div>
                <input type="submit" value="Submit"></input>
            </div>
        </form>
    );
};

ReactDOM.render(ClientAppRoot('appState', 'en'), document.getElementById('app'));
