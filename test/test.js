const expect = require("chai").expect;
const servgen = require("../index");


describe('Servgen', () => {
    let servicesDirectory = __dirname+'/services';
    
    it('should check for a valid app object as parameter', async () => {
        try {
            let app = null;
            await servgen.init(app,servicesDirectory);
            expect(app).to.not.be.an('object');
        } catch (err){
            expect(err.message).to.equal('app instance passed is not an object');
        }
    });
    
    it('should check for a valid services directory as parameter', async () => {
        try {
            let app = {};
            await servgen.init(app, '/unknow/directory');
            expect(app).to.not.be.an('object');
        } catch (err){
            expect(err.message).to.equal('path passed is does not exist');
        }
    });
    
    it('should check for a valid order array as parameter', async () => {
        try {
            let app = {};
            await servgen.init(app, servicesDirectory, 'array');
            expect(app).to.not.be.an('object');
        } catch (err){
            expect(err.message).to.equal('order passed is not an array');
        }
    });

    it('should initialize a service from a file', async () => {
        let app = {};
        
        await servgen.init(app,servicesDirectory);
        
        expect(app).to.have.property('config');
        expect(app.config.name).to.equal('test');
    });
    
    it('should initialize service from a directory', async () => {
        let app = {};
        
        await servgen.init(app,servicesDirectory);
        
        expect(app).to.have.property('server');
        expect(app.server.name).to.equal('server');
    });
});
