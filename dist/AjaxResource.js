'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _resourceUrlBuilder = require('./resourceUrlBuilder');

var _AjaxLoader = require('./AjaxLoader');

var _AjaxLoader2 = _interopRequireDefault(_AjaxLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxResource = function () {
    function AjaxResource(apiUrl) {
        var ajaxOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var requestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

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

        this._ajaxLoader = new _AjaxLoader2.default(ajaxOptions, requestor);
        this._isAbortable = false;
    }

    _createClass(AjaxResource, [{
        key: '_request',
        value: function _request(params) {
            if (!this._isAbortable && this._ajaxLoader.isLoading()) {
                return Promise.reject(new Error('Request failed'));
            }

            this._isAbortable = params.method === 'GET';
            return this._ajaxLoader.request(params);
        }
    }, {
        key: '_updateRequest',
        value: function _updateRequest(formData, method) {
            var _this = this;

            var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            var data = this.mapInput(formData, id);
            data = JSON.stringify(data);

            return this._request({
                url: (0, _resourceUrlBuilder.resourceUrl)(this.apiUrl, id),
                method: method,
                contentType: 'application/json; charset=utf-8',
                data: data
            }).then(function (res) {
                return _this.mapGetOutput(res);
            });
        }
    }, {
        key: 'getAll',
        value: function getAll(params) {
            var _this2 = this;

            return this._request({
                url: (0, _resourceUrlBuilder.findAll)(this.apiUrl, this.mapParams(params)),
                method: 'GET'
            }).then(function (data) {
                return _this2.mapGetAllOutput(data);
            });
        }
    }, {
        key: 'getById',
        value: function getById(id) {
            var _this3 = this;

            return this._request({
                url: (0, _resourceUrlBuilder.resourceUrl)(this.apiUrl, id),
                method: 'GET'
            }).then(function (data) {
                return _this3.mapGetOutput(data);
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
            if (this._isAbortable) {
                this._ajaxLoader.abort();
            }
        }
    }]);

    return AjaxResource;
}();

exports.default = AjaxResource;