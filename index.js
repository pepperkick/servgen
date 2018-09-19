const fs = require('fs');
const path = require('path');

const debug = require('debug')('module:servgen');

module.exports.init = async(app, path = __dirname + '/services') => {
    let services = {};

    walkDirectory(services, path);

    for (let serviceName in services) {
        app[serviceName] = await require(services[serviceName])(app);
        debug('attached a new service with name:', serviceName);
    }
}

let walkDirectory = (defs, directoryPath) => {
    const serviceExtension = '.js';

    let files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        let filepath = path.join(directoryPath, file);
        debug('current file:', filepath);

        if (fs.statSync(filepath).isDirectory()) {
            debug('is a directory');
            walkDirectory(defs, filepath);
        }
        else {
            if (file.endsWith(serviceExtension)) {
                debug('is a service file');

                let name = file.split(serviceExtension)[0];

                debug('service name:', name);

                defs[name] = filepath;
            }
            else {
                console.log('file with unknown purpose', filepath);
            }
        }
    });
}
