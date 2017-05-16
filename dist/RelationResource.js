'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AjaxLoader = require('./AjaxLoader');

var _AjaxLoader2 = _interopRequireDefault(_AjaxLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelationResource = function () {
    function RelationResource(apiUrl) {
        var _this = this;

        var ajaxOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var requestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        _classCallCheck(this, RelationResource);

        this._reject = null;
        this._resolve = null;
        this._timeout = null;
        this._requestPromise = null;

        this._key = null;
        this._value = null;

        this.keys = [];
        this.promise = this._createPromise();
        this.apiUrl = apiUrl;

        this._ajaxLoader = new _AjaxLoader2.default(ajaxOptions, requestor);

        this._makeQuery = function (ids, url) {
            return {
                url: _this._makeUrl(url, { ids: ids.join(',') }),
                method: 'GET'
            };
        };

        this._makeMap = function (data, key, value) {
            var map = {};
            data.data.forEach(function (el) {
                map[el[key]] = el[value];
            });
            return map;
        };
    }

    _createClass(RelationResource, [{
        key: '_makeUrl',
        value: function _makeUrl(url, query) {
            var separator = url.match(/\?/) ? '&' : '?';

            var queryString = Object.keys(query).map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
            }).join('&');

            return '' + url + separator + queryString;
        }
    }, {
        key: '_createPromise',
        value: function _createPromise() {
            var _this2 = this;

            return new Promise(function (res, rej) {
                _this2._resolve = res;
                _this2._reject = rej;
            });
        }
    }, {
        key: '_requestData',
        value: function _requestData() {
            var _this3 = this;

            if (this.keys.length === 0 || this._requestPromise !== null) {
                return;
            }

            this.keys = [];
            var reject = this._reject;
            var resolve = this._resolve;
            this.promise = this._createPromise();
            this._requestPromise = this._ajaxLoader.request(this._makeQuery(this.keys, this.apiUrl)).then(function (data) {
                var map = _this3._makeMap(data, _this3._key, _this3._value);
                resolve(map);
            }).catch(function (e) {
                reject(e);
            }).then(function () {
                _this3._requestPromise = null;
                _this3._requestData();
            });
        }
    }, {
        key: 'setKeyValue',
        value: function setKeyValue(value) {
            var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';

            this._value = value;
            this._key = key;
            return this;
        }
    }, {
        key: 'onBeforeQuery',
        value: function onBeforeQuery(fn) {
            this._makeQuery = fn;
            return this;
        }
    }, {
        key: 'onDataLoad',
        value: function onDataLoad(fn) {
            this._makeMap = fn;
            return this;
        }
    }, {
        key: 'load',
        value: function load(key) {
            var _this4 = this;

            if (this.keys.indexOf(key) === -1) {
                this.keys.push(key);
            }
            if (this._timeout === null) {
                this._timeout = setTimeout(function () {
                    _this4._requestData();
                    _this4._timeout = null;
                }, 10);
            }
            return this.promise;
        }
    }, {
        key: 'abort',
        value: function abort() {
            this._ajaxLoader.abort();
        }
    }]);

    return RelationResource;
}();

module.exports = RelationResource;