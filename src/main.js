'use strict';

function Form(props) {
	return (
		<div>
			<input type="text" placeholder="kitten" onChange = {props.onChange}/>
			<button onClick={props.onClick} disabled={props.disabled}>
				Search
			</button>
		</div>
	);
}

class Pictures extends React.Component {
	render() {

		if (this.props.res == null) {
			return (<div />);
		}

		let count = 0;
		const pictures = this.props.res.photos.photo.map((p, i) => {
			const farmId = p.farm;
			const serverId = p.server;
			const id = p.id;
			const secret = p.secret;

			console.log(farmId + ", " + serverId + ", " + id + ", " + secret);

			if (serverId != 0) {
				count += 1;
				return (
					<div className="cell">
						<img src={'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '.jpg'}/>
					</div>
				)
			}

		});

		return (<div className="grid">{pictures}</div>);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'kitten',
			init: true,
			loading: false,
			error: false,
			errorMassage: null,
			result: null,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	toggleLoading() {

	}
	
	throwError(message) {
		this.setState({
			loading: false,
			error: true,
			errorMassage: message,
		})
		console.log(message)
	}
	
	handleChange(e) {
		this.setState({value: e.target.value});
	}
	
	handleClick(e) {
		e.preventDefault();
		this.setState({
			init: true,
			loading: true,
			error: false,
			errorMassage: null,
			result: null,
		})
		this.toggleLoading();
		
		const api_key = "a36a03b41c4468fbe13eb5abbda00768";
		const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
		const format = "json&nojsoncallback=1";
		const text = this.state.value || 'kitten';
		const endpoint = `${url}${api_key}&text=${text}&format=${format}`;
		
		console.log(endpoint)
		
		fetch(endpoint, {cache: 'no-cache'}).then(response => {
			if (response.ok) {
				return response.json();
			}
			this.throwError('API Error');
		}, networkError => {
			console.log(networkError.message)
			this.throwError('Network Error');
		}).then(jsonResponse => {
			this.setState({
				init: false,
				loading: false,
				result: jsonResponse,
			})
			console.log(jsonResponse);
		})
	}
	
	render() {
		const defaultImg = (<img src="src/img/icon-placeholder.svg" width="80%" alt="Icon placeholder"/>);
		const errorMessage = (
			<div>
				<p><strong>{this.state.errorMassage}</strong></p>
				<p>please check network connection</p>
			</div>
		);
		
		return (
			<div>
				{/* input */}
				<form className="submit">
					<Form
						onChange={(e) => this.handleChange(e)}
						onClick={(e) => this.handleClick(e)}
						disabled={this.state.loading}
					/>
				</form>
				{/* output */}
				<div className="wrapper">
					<div className={this.state.loading? "content--loading" : "content"}>
						<Pictures res={this.state.result}/>
						{this.state.error && errorMessage}
						{this.state.init && defaultImg}
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('App')
)