const x2js = require('x2js');
const validUrl = require('./lib/check-url').validUrl;
const request = require('./lib/request').request;

const defaultUrls = {
    development: "https://secure.tryout-eurodns.com:20015/v2/index.php",
    production: "https://secure.api-eurodns.com:20015/v2/index.php"
};

const XMLString = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<request xmlns:ip="http://www.eurodns.com/ip">\n' +
    '    <ip:list/>\n' +
    '</request>\n'

const XMLresp = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<response xmlns:tld="http://www.eurodns.com/tld">\n' +
    '    <result code="1000">\n' +
    '        <msg>Command completed successfully</msg>\n' +
    '    </result>\n' +
    '    <resData>\n' +
    '        <tld:list numElements="#LISTCOUNTER#">\n' +
    '            <tld:name>#TLD#</tld:name>\n' +
    '            <tld:name>#TLD#</tld:name>\n' +
    '            <tld:name>#TLD#</tld:name>\n' +
    '        </tld:list>\n' +
    '    </resData>\n' +
    '</response>'

const domainLookup = {
    "request": {
        "check": {
            "name": {
                "__prefix": "domain",
                "__text": "#DOMAIN.TLD#"
            },
            "__prefix": "domain"
        },
        "_xmlns:domain": "http://www.eurodns.com/domain"
    }
}
const Agent = require('./models/agent')
const Ip = require('./models/ip')
const TLD = require('./models/tld')

/**
 * This is the main class containing all parameters
 * The config object has following structure
 *
 * {
 *      x2js:       Object      Optional    All params for setting up x2js, see https://github.com/abdmob/x2js#config-options
 *      mode:       String      Optional    "production" or "development" (dev is default)
 *      uri:        String      Optional    The URL of the server you wish to use, otherwise the defaults will be used
 * }
 */
class euroDNSAPI {
    constructor (config) {
        this.config = {};

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

        //console.log(JSON.stringify(this.x2js.xml2js( XMLString )))
        console.log(JSON.stringify(this.x2js.xml2js( XMLresp)))
        //console.log(this.x2js.js2xml(domainLookup))

    }

};

module.exports = new euroDNSAPI()
