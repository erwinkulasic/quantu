#! /usr/bin/env node

const arg = require('arg');
const { exec } = require('child_process');
const chokidar = require('chokidar');
const fs = require('node:fs');
const color = require('ansi-colors');
const path = require('node:path');
const { type } = require('node:os');

function KillSubprocess(pid) {
    exec(type() === 'Windows_NT' ? `taskkill /PID ${pid} /F /T` : `kill -9 ${pid}`);
}

function CreateSubprocess(command) {
    let proc = exec(command);

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr);

    return proc;
}

function Supervision(script) {
    let subprocess = CreateSubprocess(script);
    const watcher = chokidar.watch('./', { persistent: true });

    watcher.on('change', () => {
        KillSubprocess(subprocess.pid)
        subprocess = CreateSubprocess(script);

        console.log(color.magenta('Quantu'), color.green('Refreshed'))
    })

    watcher.on('ready', () => console.log(color.magenta('Quantu'), color.green('Watching')))
}


function Quantu() {
    try {
        const args = arg(
            {
                '--help': Boolean,
                '--version': Boolean,
                '--run': String
            },
            (options = { permissive: false, argv: process.argv.slice(2) })
        );

        if (args['--version']) {
            console.log(color.magenta('Quantu'), color.gray(`version: ${require('../package.json').version}`))
            return;
        }

        if (args['--help']) {
            console.log(color.magenta('Quantu'), color.green('Help'), '\n', color.gray(`--run = <script name>`), '\n', color.gray(`--version`))
            return;
        }

        const scripts = require(path.resolve('package.json'))?.scripts;

        if (scripts === undefined || Object.keys(scripts).length === 0) {
            throw new Error("No scripts were defined in package.json");
        }

        if (args['--run']) {
            if (scripts[args['--run']] === undefined) {
                throw new Error(`The specified script doesn't exists in the package.json.\n Avaiable scripts:\n${
                    Object.keys(scripts).map((name, index) => ` ${index}: ${name} \n`).join('')
                }`);
            }

            Supervision(`npm run ${args['--run']}`);
        } else {
            Supervision(`npm start`);
        }
    } catch (error) {
        console.log(color.magenta('Quantu'), color.red(error.message));
    }
}

Quantu();
