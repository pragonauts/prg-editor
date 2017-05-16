'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxLoader = function () {
    function AjaxLoader() {
        var ajaxOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var requestor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _jquery2.default.ajax;

        _classCallCheck(this, AjaxLoader);

        this._serverRequest = null;

        this._requestor = requestor;

        this._ajaxOptions = {
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json'
        };
    }

    _createClass(AjaxLoader, [{
        key: 'isLoading',
        value: function isLoading() {
            return !!this._serverRequest;
        }
    }, {
        key: 'request',
        value: function request(params) {
            var _this = this;

            if (this._serverRequest) {
                this.abort();
            }

            return new Promise(function (resolve, reject) {
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
        key: 'abort',
        value: function abort() {
            if (this._serverRequest) {
                this._serverRequest.abort();
                this._serverRequest = null;
            }
        }
    }]);

    return AjaxLoader;
}();

module.exports = AjaxLoader;