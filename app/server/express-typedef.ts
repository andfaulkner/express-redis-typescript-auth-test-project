import * as express from 'express';

export interface expressRequestExtended extends express.Request {
    body: {
        username: string;
        password: string;
        admin?: boolean | string;
        token?: string;
    };
    user: {
        username: string;
        password: string;
    },
    flash(message: string): any;
    flash(event: string, message: string): any;
    query: {
        token?: string
    }
    decoded: {};
}
