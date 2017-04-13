/*
 * @author David Menger
 */

import $ from 'jquery';

class AjaxLoader {

    /**
     * Creates an instance of AjaxResource.
     *
     * @param {string} apiUrl - resource url
     * @param {object} [ajaxOptions={}] - options passed to $.ajax
     * @param {any} [requestor=$.ajax] - alternative to $.ajax
     *
     * @memberOf AjaxResource
     */
    constructor (ajaxOptions = {}, requestor = $.ajax) {

        // abitily to abort request
        this._serverRequest = null;

        // $.ajax
        this._requestor = requestor;

        this._ajaxOptions = {
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json'
        };
    }

    isLoading () {
        return !!this._serverRequest;
    }

    request (params) {
        if (this._serverRequest) {
            this.abort();
        }
        // make new request
        return new Promise((resolve, reject) => {
            this._serverRequest = this._requestor(Object.assign({},
                this._ajaxOptions,
                params,
                {
                    success: (data) => {
                        this._serverRequest = null;
                        resolve(data);
                    },
                    error: (jqXHR) => {
                        this._serverRequest = null;
                        reject(jqXHR);
                    }
                }));
        });
    }

    abort () {
        if (this._serverRequest) {
            this._serverRequest.abort();
            this._serverRequest = null;
        }
    }

}

module.exports = AjaxLoader;
