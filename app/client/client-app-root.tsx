import * as React from 'react';
import * as ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';

interface ClientAppRootProps {
    appState: any;
    lang: string;
}

class ClientAppRoot extends React.Component<ClientAppRootProps, {}> {
 
    constructor(props) {
        super(props);
    }

    attemptLogin = (event) => {
        event.preventDefault();
        console.log('attempting login!');
        fetch('/auth/login').then((data) => {
            console.log('success! Data returned:', data);
        });
    }
 
    render() {
        console.log('rendered....');
        return (
           <form action="/auth/login" method="POST">
               <div>
                   Username!:
               </div>
               <input type="text" name="username"></input>
               <div>
                   Password:
               </div>
               <input type="text" name="password"></input>
               <div>
                   <input onClick={this.attemptLogin}></input>
               </div>
           </form>
        );
    }
};

ReactDOM.render(<ClientAppRoot appState={{}} lang='en'/>, document.getElementById('app'));
