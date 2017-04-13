/*
 * @author David Menger
 */

import { findAll, resourceUrl } from './resourceUrlBuilder';
import AjaxLoader from './AjaxLoader';

/**
 * Rest API Resource data fetcher
 *
 * - enables crossdomain requrests
 * - enables CORS credentials (sends cookies)
 * - uses classic `GET/PUT/POST/DELETE` endpoints
 *
 * @class AjaxResource
 */
class AjaxResource {

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

        this.apiUrl = apiUrl;

        /**
         * Map response data after `GET/PUT /resource/:id` & `POST /resource`
         * @prop {function}
         */
        this.mapGetOutput = data => data;

        /**
         * Map response data after `GET /resource`
         * @prop {function}
         */
        this.mapGetAllOutput = data => data;

        /**
         * Map body data before `PUT /resource/:id` and `POST /resource`
         * @prop {function}
         */
        this.mapInput = data => data;

        /**
         * Map query params called before `GET /resource`
         * @prop {function}
         */
        this.mapParams = params => params;

        this._loadedDataId = null;

        // abitily to abort request
        this._ajaxLoader = new AjaxLoader(ajaxOptions, requestor);
        this._isAbortable = false;
    }

    _request (params) {
        // cleanup previous requests
        if (!this._isAbortable && this._ajaxLoader.isLoading()) {
            return Promise.reject(new Error('Request failed'));
        }

        this._isAbortable = params.method === 'GET';
        return this._ajaxLoader.request(params);
    }

    _updateRequest (formData, method, id = undefined) {
        let data = this.mapInput(formData, id);
        data = JSON.stringify(data);

        return this._request({
            url: resourceUrl(this.apiUrl, id),
            method,
            contentType: 'application/json; charset=utf-8',
            data
        }).then(res => this.mapGetOutput(res));
    }

    /**
     * Fetch all data
     *
     * @param {Object} params
     * @returns {Promise.<{ data: [], offset: number, nextOffset: mumber }>}
     *
     * @memberOf AjaxResource
     */
    getAll (params) {
        return this._request({
            url: findAll(this.apiUrl, this.mapParams(params)),
            method: 'GET'
        }).then(data => this.mapGetAllOutput(data));
    }

    /**
     * Get Single Element Data
     *
     * @param {string} id
     * @returns {Promise.<Object>}
     *
     * @memberOf AjaxResource
     */
    getById (id) {
        return this._request({
            url: resourceUrl(this.apiUrl, id),
            method: 'GET'
        }).then(data => this.mapGetOutput(data));
    }

    /**
     * Send data to server
     *
     * @param {Object} formData
     * @returns {Promise.<Object>}
     *
     * @memberOf AjaxResource
     */
    create (formData) {
        return this._updateRequest(formData, 'POST');
    }

    /**
     * Update data on server
     *
     * @param {string} id
     * @param {Object} formData
     * @returns {Promise.<Object>}
     *
     * @memberOf AjaxResource
     */
    update (id, formData) {
        return this._updateRequest(formData, 'PUT', id);
    }

    /**
     * Remove data by id
     *
     * @param {string} id
     * @returns {Promise}
     *
     * @memberOf AjaxResource
     */
    remove (id) {
        return this._request({
            url: resourceUrl(this.apiUrl, id),
            method: 'DELETE'
        });
    }

    /**
     * Returns identifier of the object
     *
     * @param {object} data
     * @returns {string}
     *
     * @memberOf AjaxResource
     */
    getId (data) {
        return data.id;
    }

    /**
     * Cancels current request
     *
     *
     * @memberOf AjaxResource
     */
    abort () {
        if (this._isAbortable) {
            this._ajaxLoader.abort();
        }
    }

}

export default AjaxResource;
