const snekfetch = require('snekfetch');
const apiLink = 'https://botsfordiscord.com/api';
const ClientOptions = require('./structures/ClientOptions.js').ClientOptions;
const FetchOptions = require('./structures/FetchOptions.js').FetchOptions;
const Bot = require('./structures/Bot').Bot;
const User = require('./structures/User').User;
const WidgetFetchOptions = require('./structures/WidgetFetchOptions').WidgetFetchOptions;

class Client {
    /**
     * Initializes the API wrapper.
     * @param {ClientOptions} [options=ClientOptions.default] Client Options.
     */
    constructor(options = ClientOptions.default) {
        this.edit(options, true); // Note from the Developer: DO NOT TOUCH!!!!!!!
    }

    /**
     * @param {any} message The thing to console log.
     * @private
     */
    _log(message) {
        if (this.options.log) console.log(message);
    }

    /**
     * Post your server count to your bot. Bot ID is supplied ID from initialization.
     * @param {Number} [serverSize] The server count to supply. If you supply a valid client on initialization, supplying this value is unnecessary; Supplying a value overrides the auto value set.
     * @returns {Promise<Object>} Returns a message.
     */

    setCount(serverSize) {
        if (!this.options.token) throw new ReferenceError('To post your server count, you must supply an API token on initialization.');
        if (!serverSize && !this.options.client) throw new ReferenceError('serverSize must be supplied; Not needed if you supply a valid client on initialization.');
        if (this.options.client && !serverSize) serverSize = this.options.client.guilds.size;
        if (typeof serverSize !== 'number') throw new TypeError('serverSize must be a number.');
        const data = {
            server_count: serverSize
        };
        return new Promise((resolve, reject) => {
            snekfetch.post(`${apiLink}/bot/${this.options.botID}`)
                .send(data)
                .set({ Authorization: this.options.token, 'Content-Type': 'application/json' })
                .then((body) => {
                    resolve(body.body);
                })
                .catch(reject);
        });
    }

    /**
     * Fetch a bot from the list.
     * @param {String} botID The bot ID to fetch
     * @param {FetchOptions} [options={}] Only supply if you want to get a specific value, etc. "verified" or "name" (Disclaimer: This does not detect non-existant values)
     * @returns {Promise<Bot>} Returns the fetched bot data.
     */

    fetchBot(botID, options = {}) {
        if (!botID) throw new ReferenceError('The bot ID must be supplied.');
        if (typeof botID !== 'string') throw new TypeError('The bot ID must be a string.');
        if (botID.length !== 18) throw new SyntaxError('The bot ID must be exactly an 18-digit number-string thing');
        return new Promise((resolve, reject) => {
            snekfetch.get(`${apiLink}/bot/${botID}`)
                .then(response => {
                    const Options = new FetchOptions(options);
                    if (Options.normal) {
                        this._log(Options.specified ? response.body[Options.specified] : response.body);
                        resolve(Options.specified ? response.body[Options.specified] : response.body);
                    } else {
                        const BfdBot = new Bot(response.body);
                        this._log(Options.specified ? BfdBot[Options.specified] : BfdBot);
                        resolve(Options.specified ? BfdBot[Options.specified] : BfdBot);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Fetch a bot using the ID supplied on initialization.
     * @param {FetchOptions} [options={}] Only supply if you want to get a specific value, etc. "verified" or "name" (Disclaimer: This does not detect non-existant values)
     * @returns {Promise<Bot>} Returns the fetched bot data.
     */

    fetchSelf(options = {}) {
        if (!this.options.botID) throw new ReferenceError('The botID must be supplied on initialization.');
        return new Promise((resolve, reject) => {
            this.fetchBot(this.options.botID, options)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Check if a bot is verified. Shorthand convenience function for this.fetchBot(botID, 'verified')
     * @param {String} botID I guess if you wanted to check if a bot was verified...you could use this...
     * @returns {Promise<Boolean>} Returns true or false, depending if the bot is verified or not.
     */

    checkVerif(botID) {
        if (!botID) throw new ReferenceError('The options.botID must be supplied.');
        if (typeof botID !== 'string') throw new TypeError('The bot ID must be a string.');
        if (botID.length !== 18) throw new SyntaxError('The bot ID must be exactly an 18-digit number-string thing');
        return new Promise((resolve, reject) => {
            this.fetchBot(botID, { specified: 'isVerified' })
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Check if your own bot is verified.
     * @returns {Promise<Boolean>} Returns true or false, depending if the bot is verified or not.
     */
    checkVerifSelf() {
        if (!this.options.botID) throw new ReferenceError('The options.botID must be supplied.');
        return new Promise((resolve, reject) => {
            this.checkVerif(this.options.botID)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Fetch a user that has logged on to the list.
     * @param {String} userID The user ID to fetch.
     * @param {FetchOptions} [options={}] A specific thing to get, like
     * @returns {Promise<User>} Returns the user data.
     */
    fetchUser(userID, options = {}) {
        if (!userID) throw new ReferenceError('The user ID must be supplied.');
        if (typeof userID !== 'string') throw new TypeError('The user ID must be a string.');
        if (userID.length !== 18) throw new SyntaxError('The user ID must be exactly an 18-digit number-string thing');
        return new Promise((resolve, reject) => {
            snekfetch.get(`${apiLink}/user/${userID}`)
                .then(response => {
                    const Options = new FetchOptions(options);
                    if (Options.normal) {
                        this._log(Options.specified ? response.body[Options.specified] : response.body);
                        resolve(Options.specified ? response.body[Options.specified] : response.body);
                    } else {
                        const BfdUser = new User(response.body);
                        this._log(Options.specified ? BfdUser[Options.specified] : BfdUser);
                        resolve(Options.specified ? BfdUser[Options.specified] : BfdUser);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Change a value of the object.
     * @param {ClientOptions} options Client Options for change.
     * @param {Boolean} preset Whether or not to have preset options.
     * @returns {this}
     * @example
     * console.log(Client.edit({ log: false }));
     */
    edit(options = ClientOptions.default, preset = false) {
        if (!options) throw new ReferenceError('options must be defined.');
        if (options !== Object(options) || options instanceof Array) throw new TypeError('options must be an object.');
        if (options.token && typeof options.token !== 'string') throw new TypeError('options.token must be a string.');
        if (options.botID && typeof options.botID !== 'string') throw new TypeError('options.botID must be a string.');
        if (options.log && typeof options.log !== 'boolean') throw new TypeError('options.log must be a boolean value.');

        this.options = new ClientOptions(options, preset ? ClientOptions.default : this.options);

        return this;
    }

    /**
     * Fetch a widget of a bot on the list.
     * @param {String} botID The bot ID to fetch.
     * @param {WidgetFetchOptions} options Widget Fetch Options.
     * @returns {Promise<Buffer>} The widget buffer.
     * @example
     * const fs = require('fs');
     *
     * Client.fetchWidget('463803888072523797')
     *  .then(widget => fs.writeFileSync('widget.jpeg', widget))
     *  .catch(console.log);
     */
    fetchWidget(botID, options = {}) {
        if (!botID) throw new ReferenceError('botID must be provided.');
        if (typeof botID !== 'string') throw new TypeError('botID must be a string.');
        if (options !== Object(options) || options instanceof Array) throw new TypeError('options must be an object.');

        return new Promise((resolve, reject) => {
            const Options = new WidgetFetchOptions(options);
            if (Options.width < 400 || Options.height < 180) console.warn('Any widgets with a size smaller than 400x180 may be distorted at a level.');
            snekfetch.get(`${apiLink}/bot/${botID}/widget${Options.width}${Options.height}`)
                .then(widget => {
                    this._log(widget.body);
                    resolve(widget.body);
                })
                .catch(reject);
        });
    }

    /**
     * Fetch the widget of the self bot.
     * @param {WidgetFetchOptions} options Widget Fetch Options
     * @returns {Promise<Buffer>} The widget buffer.
     */
    fetchWidgetSelf(options = {}) {
        return new Promise((resolve, reject) => {
            this.fetchWidget(this.options.botID, options)
                .then(resolve)
                .catch(reject);
        });
    }
}

Client.APILink = apiLink;

module.exports = Client;