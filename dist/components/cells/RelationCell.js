'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RelationCell = function (_Component) {
    _inherits(RelationCell, _Component);

    function RelationCell(props) {
        _classCallCheck(this, RelationCell);

        var _this = _possibleConstructorReturn(this, (RelationCell.__proto__ || Object.getPrototypeOf(RelationCell)).call(this, props));

        _this.resource = props.config.resource;

        _this.state = {
            isLoading: true,
            error: null,
            value: null
        };
        return _this;
    }

    _createClass(RelationCell, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var _props = this.props,
                data = _props.data,
                config = _props.config;

            var identifier = data[config.attr];

            this.resource.load(identifier).then(function (dict) {
                var value = dict[identifier];

                if (config.map) {
                    value = config.map(value, data);
                }

                _this2.setState({ value: value, isLoading: false });
            }).catch(function (error) {
                _this2.setState({ error: error, isLoading: false });
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.resource.abort();
            this.resource = null;
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                isLoading = _state.isLoading,
                error = _state.error,
                value = _state.value;
            var _props$config = this.props.config,
                loaderContent = _props$config.loaderContent,
                errorContent = _props$config.errorContent;


            if (isLoading) {
                return _react2.default.createElement(
                    'div',
                    null,
                    loaderContent
                );
            } else if (error) {
                return _react2.default.createElement(
                    'div',
                    null,
                    errorContent
                );
            }

            return _react2.default.createElement(
                'div',
                null,
                value
            );
        }
    }]);

    return RelationCell;
}(_react.Component);

RelationCell.propTypes = {
    data: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
    config: _propTypes2.default.shape({
        attr: _propTypes2.default.string.isRequired,
        map: _propTypes2.default.func,
        loaderContent: _propTypes2.default.any,
        errorContent: _propTypes2.default.any,
        resource: _propTypes2.default.shape({
            load: _propTypes2.default.func.isRequired,
            abort: _propTypes2.default.func.isRequired
        }).isRequired
    }).isRequired
};

exports.default = RelationCell;