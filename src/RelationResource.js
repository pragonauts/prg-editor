/*
 * @author David Menger
 */

import AjaxLoader from './AjaxLoader';

/**
 * Ajax loader for relation cells
 *
 * @class RelationResource
 */
class RelationResource {

    /**
     * Creates an instance of AjaxResource.
     *
     * @param {string} apiUrl - resource url
     * @param {object} [ajaxOptions={}] - options passed to $.ajax
     * @param {any} [requestor=$.ajax] - alternative to $.ajax
     *
     * @memberOf AjaxResource
     */
    constructor (apiUrl, ajaxOptions = {}, requestor = undefined) {
        this._reject = null;
        this._resolve = null;
        this._timeout = null;
        this._requestPromise = null;

        this._key = null;
        this._value = null;

        this.keys = [];
        this.promise = this._createPromise();
        this.apiUrl = apiUrl;

        this._ajaxLoader = new AjaxLoader(ajaxOptions, requestor);

        this._makeQuery = (ids, url) => ({
            url: this._makeUrl(url, { ids: ids.join(',') }),
            method: 'GET'
        });

        this._makeMap = (data, key, value) => {
            const map = {};
            data.data.forEach((el) => {
                map[el[key]] = el[value];
            });
            return map;
        };
    }

    _makeUrl (url, query) {
        const separator = url.match(/\?/)
            ? '&'
            : '?';

        const queryString = Object.keys(query)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
            .join('&');

        return `${url}${separator}${queryString}`;
    }

    _createPromise () {
        return new Promise((res, rej) => {
            this._resolve = res;
            this._reject = rej;
        });
    }

    _requestData () {
        if (this.keys.length === 0 || this._requestPromise !== null) {
            return;
        }

        this.keys = [];
        const reject = this._reject;
        const resolve = this._resolve;
        this.promise = this._createPromise();
        this._requestPromise = this._ajaxLoader
            .request(this._makeQuery(this.keys, this.apiUrl))
            .then((data) => {
                const map = this._makeMap(data, this._key, this._value);
                resolve(map);
            })
            .catch((e) => {
                reject(e);
            })
            .then(() => {
                this._requestPromise = null;
                this._requestData();
            });
    }

    setKeyValue (value, key = 'id') {
        this._value = value;
        this._key = key;
        return this;
    }

    onBeforeQuery (fn) {
        this._makeQuery = fn;
        return this;
    }

    onDataLoad (fn) {
        this._makeMap = fn;
        return this;
    }

    load (key) {
        if (this.keys.indexOf(key) === -1) {
            this.keys.push(key);
        }
        if (this._timeout === null) {
            this._timeout = setTimeout(() => {
                this._requestData();
                this._timeout = null;
            }, 10);
        }
        return this.promise;
    }

    abort () {
        this._ajaxLoader.abort();
    }

}

module.exports = RelationResource;
