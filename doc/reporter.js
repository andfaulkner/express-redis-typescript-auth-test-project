#!/usr/bin/env node
const inspect = require('util').inspect;
const _ = require('lodash');

const ld = _.mixin.call(_, {
    secondLast: (str) => this.last(str),
});

ld.secondLast('adfsd')

const chunks = [];

console.log(`\nprocess.pid: ${process.pid}\n`);

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    console.log(`\nHello chunk!\n`);
    if (chunk !== null) {
        if (_.last(chunks) && _.secondLast(chunks))
        chunks.push(chunk.toString());
        process.stdout.write(`data: ${chunk}`);
    }
    console.log(chunks);
});

process.stdin.on('end', () => {
    console.log(`END END END`);
});