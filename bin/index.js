#! /usr/bin/env node

const arg = require('arg');
const fs = require('node:fs');
const path = require('node:path');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const os = require('node:os');
const { Transform } = require('node:stream');

function getPackageScripts() {
    const package = JSON.parse(
        fs.readFileSync(
            path.resolve('package.json')
        )
    )

    return package?.scripts;
}

function CreateSubprocess(command) {
    let proc = exec(command);
    proc.stdout.pipe(process.stdout)
    proc.stderr
        .pipe(new Transform({
            transform(chunk, encoding, callback) {
                callback(null, String(`\x1b[35mQUANTU \x1b[31mError \x1b[0m \r\n\n${chunk.toString()}`));
            }
        }))
        .pipe(process.stderr);

    return proc;
}

function Supervision(script) {

    const currentOS = os.type();
    let subprocess = CreateSubprocess(script);

    const watcher = chokidar.watch('./', {
        persistent: true
    });

    watcher.on('change', () => {
        if (currentOS === 'Windows_NT') {
            exec(`taskkill /PID ${subprocess.pid} /F /T`);
        } else if (currentOS === 'Linux' || currentOS === 'Darwin') {
            exec(`kill -9 ${subprocess.pid}`);
        }

        subprocess = CreateSubprocess(script);

        console.log("\x1b[35m", "QUANTU", "\x1b[32m", "Refreshed", "\x1b[0m");
    })

    watcher.on('ready', () => {
        console.log("\x1b[35m", "QUANTU", "\x1b[32m", "Watching", "\x1b[0m");
    })
}

function quantu() {
    try {
        const args = arg(
            {
                '--help': Boolean,
                '--run': String
            },
            (options = { permissive: false, argv: process.argv.slice(2) })
        );

        if (args['--help']) {
            console.log("\x1b[35m", "QUANTU", "\x1b[32m", "CLI", "\x1b[0m", "\n");
            console.log("\t\x1b[34mdefault npm stage is < start >\n");
            console.log('\t--run = < stage >\n \x1b[0m')
            return;
        }

        const scripts = getPackageScripts();

        if (scripts === undefined && Object.keys(scripts).length === 0) {
            throw new Error("No scripts were defined in package.json");
        }

        if (args['--run']) {
            if (scripts[args['--run']] === undefined) {
                throw new Error("The specified script doesn't exists in the package.json");
            }

            Supervision(`npm run ${args['--run']}`);
        } else {
            Supervision(`npm start`);
        }
    } catch (error) {
        console.log("\x1b[35m", "QUANTU", "\x1b[31m", error.message, "\x1b[0m");
    }
}

quantu();
