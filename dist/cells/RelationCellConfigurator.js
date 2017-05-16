'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCellConfigurator2 = require('./BaseCellConfigurator');

var _BaseCellConfigurator3 = _interopRequireDefault(_BaseCellConfigurator2);

var _RelationCell = require('../components/cells/RelationCell');

var _RelationCell2 = _interopRequireDefault(_RelationCell);

var _RelationResource = require('../RelationResource');

var _RelationResource2 = _interopRequireDefault(_RelationResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RelationCellConfigurator = function (_BaseCellConfigurator) {
    _inherits(RelationCellConfigurator, _BaseCellConfigurator);

    function RelationCellConfigurator(attr, name) {
        var translator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, RelationCellConfigurator);

        var _this = _possibleConstructorReturn(this, (RelationCellConfigurator.__proto__ || Object.getPrototypeOf(RelationCellConfigurator)).call(this, attr, name, translator));

        _this.config.Cell = _RelationCell2.default;

        _this.config.resource = null;

        _this.config.loaderContent = null;

        _this.config.errorContent = 'X';
        return _this;
    }

    _createClass(RelationCellConfigurator, [{
        key: 'setResource',
        value: function setResource(resource) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';

            if (typeof resource === 'string') {
                var res = new _RelationResource2.default(resource);
                if (value !== null) {
                    res.setKeyValue(value, key);
                }
                this.config.resource = res;
            } else {
                this.config.resource = resource;
            }
            return this;
        }
    }, {
        key: 'setLoader',
        value: function setLoader(loader) {
            this.config.loaderContent = loader;
            return this;
        }
    }, {
        key: 'setErrorContent',
        value: function setErrorContent(error) {
            this.config.errorContent = error;
            return this;
        }
    }]);

    return RelationCellConfigurator;
}(_BaseCellConfigurator3.default);

module.exports = RelationCellConfigurator;