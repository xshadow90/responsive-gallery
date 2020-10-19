'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Form(props) {
	return React.createElement(
		"div",
		null,
		React.createElement("input", { type: "text", placeholder: "kitten", onChange: props.onChange }),
		React.createElement(
			"button",
			{ onClick: props.onClick, disabled: props.disabled },
			"Search"
		)
	);
}

var Pictures = function (_React$Component) {
	_inherits(Pictures, _React$Component);

	function Pictures() {
		_classCallCheck(this, Pictures);

		return _possibleConstructorReturn(this, (Pictures.__proto__ || Object.getPrototypeOf(Pictures)).apply(this, arguments));
	}

	_createClass(Pictures, [{
		key: "render",
		value: function render() {

			if (this.props.res == null) {
				return React.createElement("div", null);
			}

			var count = 0;
			var pictures = this.props.res.photos.photo.map(function (p, i) {
				var farmId = p.farm;
				var serverId = p.server;
				var id = p.id;
				var secret = p.secret;

				console.log(farmId + ", " + serverId + ", " + id + ", " + secret);

				if (serverId != 0) {
					count += 1;
					return React.createElement(
						"div",
						{ className: "cell" },
						React.createElement("img", { src: 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '.jpg' })
					);
				}
			});

			return React.createElement(
				"div",
				{ className: "grid" },
				pictures
			);
		}
	}]);

	return Pictures;
}(React.Component);

var App = function (_React$Component2) {
	_inherits(App, _React$Component2);

	function App(props) {
		_classCallCheck(this, App);

		var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this2.state = {
			value: 'kitten',
			init: true,
			loading: false,
			error: false,
			errorMassage: null,
			result: null
		};

		_this2.handleChange = _this2.handleChange.bind(_this2);
		_this2.handleClick = _this2.handleClick.bind(_this2);
		return _this2;
	}

	_createClass(App, [{
		key: "toggleLoading",
		value: function toggleLoading() {}
	}, {
		key: "throwError",
		value: function throwError(message) {
			this.setState({
				loading: false,
				error: true,
				errorMassage: message
			});
			console.log(message);
		}
	}, {
		key: "handleChange",
		value: function handleChange(e) {
			this.setState({ value: e.target.value });
		}
	}, {
		key: "handleClick",
		value: function handleClick(e) {
			var _this3 = this;

			e.preventDefault();
			this.setState({
				init: true,
				loading: true,
				error: false,
				errorMassage: null,
				result: null
			});
			this.toggleLoading();

			var api_key = "a36a03b41c4468fbe13eb5abbda00768";
			var url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
			var format = "json&nojsoncallback=1";
			var text = this.state.value || 'kitten';
			var endpoint = "" + url + api_key + "&text=" + text + "&format=" + format;

			console.log(endpoint);

			fetch(endpoint, { cache: 'no-cache' }).then(function (response) {
				if (response.ok) {
					return response.json();
				}
				_this3.throwError('API Error');
			}, function (networkError) {
				console.log(networkError.message);
				_this3.throwError('Network Error');
			}).then(function (jsonResponse) {
				_this3.setState({
					init: false,
					loading: false,
					result: jsonResponse
				});
				console.log(jsonResponse);
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var defaultImg = React.createElement("img", { src: "src/img/icon-placeholder.svg", width: "80%", alt: "Icon placeholder" });
			var errorMessage = React.createElement(
				"div",
				null,
				React.createElement(
					"p",
					null,
					React.createElement(
						"strong",
						null,
						this.state.errorMassage
					)
				),
				React.createElement(
					"p",
					null,
					"please check network connection"
				)
			);

			return React.createElement(
				"div",
				null,
				React.createElement(
					"form",
					{ className: "submit" },
					React.createElement(Form, {
						onChange: function onChange(e) {
							return _this4.handleChange(e);
						},
						onClick: function onClick(e) {
							return _this4.handleClick(e);
						},
						disabled: this.state.loading
					})
				),
				React.createElement(
					"div",
					{ className: "wrapper" },
					React.createElement(
						"div",
						{ className: this.state.loading ? "content--loading" : "content" },
						React.createElement(Pictures, { res: this.state.result }),
						this.state.error && errorMessage,
						this.state.init && defaultImg
					)
				)
			);
		}
	}]);

	return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('App'));