const x2js = require('x2js');
const validUrl = require('./lib/check-url').validUrl;
const request = require('./lib/request').request;

const defaultUrls = {
    development: "https://secure.tryout-eurodns.com:20015/v2/index.php",
    production: "https://secure.api-eurodns.com:20015/v2/index.php"
};

const Agent = require('./models/agent')
const Ip = require('./models/ip')
const TLD = require('./models/tld')
const Domain = require('./models/domain')
const ContactProfile = require('./models/contactProfile')
const NameserverProfile = require('./models/nameserverProfile')
const ZoneProfile = require('./models/zoneProfile')
const Folder = require('./models/folder')

/**
 * This is the main class containing all parameters
 * The config object has following structure
 *
 * {
 *      x2js:       Object      Optional    All params for setting up x2js, see https://github.com/abdmob/x2js#config-options
 *      mode:       String      Optional    "production" or "development" (dev is default)
 *      uri:        String      Optional    The URL of the server you wish to use, otherwise the defaults will be used
 *      user:       String      Required    The Username for the EuroDNS Api
 *      password:   String      Required    The Password for the EuroDNS Api
 * }
 */
class euroDNSAPI {
    constructor (config) {
        this.config = {};

        if  (!config || !config.user || !config.password) throw new Error('Please provide at least userrname and/or password')

        this.config.user = config.user
        this.config.password = config.password

        if (config && config.mode) {

            if (['production', 'development'].indexOf(config.mode.toLowerCase()) > -1 ) {

                // mode is provided and correct
                this.config.mode = config.mode.toLowerCase();

                if (config && config.uri && validUrl(config.uri)) {

                    // Uri exists and is valid
                    this.config.uri = config.uri

                } else if (config && config.uri && !validUrl(config.uri)){

                    // Uri exists but is invalid
                    throw new Error('Please provide a valid URL')

                } else {

                    // No uri provided, using defaults
                    this.config.uri = defaultUrls[this.config.mode]

                }
            } else {

                // config.mode seems to exist, but isn't production or development
                throw new Error('Config mode must either be "production" or "development"');
            }

        } else {
            // By default we run in development mode
            this.config.mode = 'development';
            this.config.uri = defaultUrls.development;

        }

        // The axios instance
        this.request = request

        // The x2js object
        // Use x2js from config or nothing
        this.x2js = new x2js(config && config.x2js && typeof config.x2js === 'Object' ? config.x2js : {});

        // Defining all models
        this.agent = new Agent(this);
        this.ip = new Ip(this);
        this.tld = new TLD(this);
        this.domain = new Domain(this);
        this.contactProfile = new ContactProfile(this)
        this.nameserverProfile = new NameserverProfile(this)
        this.zoneProfile = new ZoneProfile(this)
        this.folder = new Folder(this)

        /*this.folder.add({name: 'test2', parentId: 98}, (err, res) => {
            if (err) console.log(err.message)

            console.log(res)
        })
        this.folder.add({name: 'test3', parentId: 98}, (err, res) => {
            if (err) console.log(err.message)

            console.log(res)
        })
        this.folder.add({name: 'appsynth'}, (err, res) => {
            if (err) console.log(err.message)

            console.log(res)
        })*/
        /*this.folder.remove('101', (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('removed folder successfully')
            }
        })*/

        /*const zone = {
            name: 'www',
            records: [{
                type: 'A',
                host: '@',
                data: '10.1.1.1'
            }]
        }

        this.zoneProfile.create(zone, (err, res) => {
            if (err) console.log(err.message)

            console.log(res)
        })*/

        this.tld.detail('beer', (err, res) => {
            if (err) console.log(err.message)

            console.log(res)
        })


    }

};

module.exports = euroDNSAPI
