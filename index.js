const fs = require('fs');
const path = require('path');

const debug = require('debug')('abskmj:servgen');

module.exports.init = async(app, path) => {
    // validate app parameter

    if (!(app instanceof Object)) {
        throw new Error(`app instance passed is not an object`);
    }

    if (!fs.existsSync(path)) {
        throw new Error(`path passed is does not exist`);
    }


    let services = {};

    walkDirectory(services, path);

    for (let serviceName in services) {
        let service = require(services[serviceName]);

        if (service && service instanceof Function) {
            app[serviceName] = await service(app);
            debug('attached a new service with name:', serviceName);
        }
        else {
            throw new Error(`index.js did not return a function. Path: ${services[serviceName]}`);
        }
    }
}

let walkDirectory = (services, directoryPath) => {
    const serviceExtension = '.js';

    let files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        let filepath = path.join(directoryPath, file);
        debug('current file:', filepath);

        if (fs.statSync(filepath).isDirectory()) {
            debug('is a directory');

            let indexFile = path.join(filepath, 'index.js');

            if (fs.existsSync(indexFile)) {
                services[file] = indexFile;
            }
            else {
                console.error('abskmj/servgen', 'index.js not found inside the service directory');
                console.error('Directory:', filepath);
            }

        }
        else {
            if (file.endsWith(serviceExtension)) {
                debug('is a service file');

                let name = file.split(serviceExtension)[0];

                debug('service name:', name);

                services[name] = filepath;
            }
            else {
                console.log('file with unknown purpose', filepath);
            }
        }
    });
}
