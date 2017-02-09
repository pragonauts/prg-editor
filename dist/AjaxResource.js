'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _resourceUrlBuilder = require('./resourceUrlBuilder');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxResource = function () {
    function AjaxResource(apiUrl) {
        var ajaxOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var requestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _jquery2.default.ajax;

        _classCallCheck(this, AjaxResource);

        this.apiUrl = apiUrl;

        this.mapGetOutput = function (data) {
            return data;
        };

        this.mapGetAllOutput = function (data) {
            return data;
        };

        this.mapInput = function (data) {
            return data;
        };

        this.mapParams = function (params) {
            return params;
        };

        this._loadedDataId = null;

        this._serverRequest = null;
        this._isAbortable = false;

        this._requestor = requestor;

        this._ajaxOptions = {
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json'
        };
    }

    _createClass(AjaxResource, [{
        key: '_request',
        value: function _request(params) {
            var _this = this;

            if (this._serverRequest !== null && !this._isAbortable) {
                return Promise.reject(new Error('Request failed'));
            } else if (this._serverRequest) {
                this.abort();
            }

            return new Promise(function (resolve, reject) {
                _this._isAbortable = params.method === 'GET';
                _this._serverRequest = _this._requestor(Object.assign({}, _this._ajaxOptions, params, {
                    success: function success(data) {
                        _this._serverRequest = null;
                        resolve(data);
                    },
                    error: function error(jqXHR) {
                        _this._serverRequest = null;
                        reject(jqXHR);
                    }
                }));
            });
        }
    }, {
        key: '_updateRequest',
        value: function _updateRequest(formData, method) {
            var _this2 = this;

            var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            var data = this.mapInput(formData, id);
            data = JSON.stringify(data);

            return this._request({
                url: (0, _resourceUrlBuilder.resourceUrl)(this.apiUrl, id),
                method: method,
                contentType: 'application/json; charset=utf-8',
                data: data
            }).then(function (res) {
                return _this2.mapGetOutput(res);
            });
        }
    }, {
        key: 'getAll',
        value: function getAll(params) {
            var _this3 = this;

            return this._request({
                url: (0, _resourceUrlBuilder.findAll)(this.apiUrl, this.mapParams(params)),
                method: 'GET'
            }).then(function (data) {
                return _this3.mapGetAllOutput(data);
            });
        }
    }, {
        key: 'getById',
        value: function getById(id) {
            var _this4 = this;

            return this._request({
                url: (0, _resourceUrlBuilder.resourceUrl)(this.apiUrl, id),
                method: 'GET'
            }).then(function (data) {
                return _this4.mapGetOutput(data);
            });
        }
    }, {
        key: 'create',
        value: function create(formData) {
            return this._updateRequest(formData, 'POST');
        }
    }, {
        key: 'update',
        value: function update(id, formData) {
            return this._updateRequest(formData, 'PUT', id);
        }
    }, {
        key: 'remove',
        value: function remove(id) {
            return this._request({
                url: (0, _resourceUrlBuilder.resourceUrl)(this.apiUrl, id),
                method: 'DELETE'
            });
        }
    }, {
        key: 'getId',
        value: function getId(data) {
            return data.id;
        }
    }, {
        key: 'abort',
        value: function abort() {
            if (this._serverRequest) {
                this._serverRequest.abort();
                this._serverRequest = null;
            }
        }
    }]);

    return AjaxResource;
}();

exports.default = AjaxResource;