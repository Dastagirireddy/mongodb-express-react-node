/* ############################ indexOfObj ##################### */
var indexOfObj = (arr, obj) => {

	var isIndex = -1;
	var isEqual = (o1, o2) => {

		if(typeof o1 === typeof o2) return JSON.stringify(o1) === JSON.stringify(o2);
		else return false;
	};

	arr.forEach((value, index) => {

		if(isEqual(value, obj)) {

			isIndex = index;
			return index;
		}
	});

	return isIndex;
};

var url = '/api/contacts';
/* ################################# Form ############################## */

var ContactForm = React.createClass({
	getInitialState: function() {

		return {
			name: '',
			email: '',
			phone: ''
		};
	},
	handleSubmit: function(e) {

		e.preventDefault();
		this.props.addContact(this.state);
		this.setState({
			name: '',
			email: '',
			phone: ''
		});
	},
	onNameChange: function(e) {

		this.setState({
			name: e.target.value
		});
	},
	onEmailChange: function(e) {

		this.setState({
			email: e.target.value
		});
	},
	onPhoneChange: function(e) {

		this.setState({
			phone: e.target.value
		});
	},
	render: function() {

		return (
			<form onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label for="name">Name</label>
					<input type="text" id="name" value={this.state.name} onChange={this.onNameChange} className="form-control" placeholder="enter your name..." />
				</div>
				<div className="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" value={this.state.email} onChange={this.onEmailChange} className="form-control" placeholder="enter your email..." />
				</div>
				<div className="form-group">
					<label for="phone">Phone</label>
					<input type="tel" id="phone" value={this.state.phone} onChange={this.onPhoneChange} className="form-control" placeholder="enter your phone..." />
				</div>
				<div className="form-group">
					<button className="btn btn-primary">Add Contact</button>
				</div>
			</form>
		);
	}
});

/* ################################# Table ############################## */

var TableRow = React.createClass({
	deleteContact: function() {

		this.props.deleteContact(this.props.contact);
	},
	render: function() {

		var contact = this.props.contact;

		return (
			<tr>
				<td>{contact._id}</td>
				<td>{contact.name}</td>
				<td>{contact.email}</td>
				<td>{contact.phone}</td>
				<td>
					<button className="btn btn-danger" onClick={this.deleteContact}>Delete</button>
				</td>
			</tr>
		);
	}
});

var Table = React.createClass({
	render: function() {

		var deleteContact = this.props.deleteContact;

		var contacts = this.props.contacts.map(function(contact){

			return (
				<TableRow contact={contact} deleteContact={deleteContact} />
			);
		});

		return (
			<table className="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>NAME</th>
						<th>EMAIL</th>
						<th>PHONE</th>
						<th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					{contacts}
				</tbody>
			</table>
		);
	}
});

/* ################################# ContactList = Form + Table ############################## */

var ContactList = React.createClass({
	getInitialState: function() {

		return {
			contacts: []
		};
	},
	onDataReceived: function(data) {

		this.setState({
			contacts: data
		});
	},
	onErrorReceived: function(err) {

		console.log(err);
	},
	componentDidMount: function() {

		$.ajax({
			type: 'GET',
			url: url,
			success: this.onDataReceived,
			error: this.onErrorReceived
		});
	},
	onContactAdded: function(data) {

		this.state.contacts.push(data);
		loadContactHTML();
	},
	addContact: function(contact) {

		$.ajax({
			type: 'POST',
			url: url,
			data: contact,
			success: this.onContactAdded,
			error: this.onErrorReceived
		});
	},
	deleteContact: function(contact) {

		var contacts = this.state.contacts;

		$.ajax({
			type: 'DELETE',
			url: url + '/' + contact._id,
			success: function(data) {

				var index = indexOfObj(contacts, contact);
				contacts.splice(index, 1);
				loadContactHTML();
			},
			error: this.onErrorReceived
		});
	},
	render: function(){

		return (
			<div className="row">
				<div className="col-md-4">
					<div className="panel panel-default">
						<div className="panel-body text-center">
							<ContactForm addContact={this.addContact} />
						</div>
					</div>
				</div>
				<div className="col-md-8">
					<div className="panel panel-default">
						<div className="panel-body">
							<Table contacts={this.state.contacts} deleteContact={this.deleteContact}  />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

loadContactHTML();

function loadContactHTML() {

	ReactDOM.render(<ContactList />, document.getElementById('content'));
}

