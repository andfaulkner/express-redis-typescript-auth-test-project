// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/b93dc24e1bb336852b9ad97509b84b90afe4e28a/argon2/index.d.ts
declare module 'argon2' {
// Type definitions for argon2 0.14
// Project: https://github.com/ranisalt/node-argon2#readme
// Definitions by: Peter Safranek <https://github.com/pe8ter>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

namespace argon2 {

    export var defaults: {
        timeCost: number;
        memoryCost: number;
        parallelism: number;
        argon2d: boolean;
    };

    export var limits: {
        memoryCost: {
            min: number;
            max: number;
        };
        timeCost: {
            min: number;
            max: number;
        };
        parallelism: {
            min: number;
            max: number;
        };
    };

    export function hash(plain: string, salt: Buffer, options?: {
        timeCost?: number;
        memoryCost?: number;
        parallelism?: number;
        argon2d?: boolean;
    }): Promise<string>;

    export function verify(hash: string, plain: string): Promise<boolean>;

    export function generateSalt(length?: number): Promise<Buffer>;
}

export = argon2;
}
