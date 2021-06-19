import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import TodoList from './comps/todo-list'

class Todo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			todoList: [],
			showTooltip: false
		}
	}
	
	componentDidMount () {
		this._getTodoList();
  	}
	
	_getTodoList () {
		const that = this;
  		$.ajax({
  			url: '/getAllItems',
  			type: 'get',
  			dataType: 'json',
  			success: data => {
  				console.log(data);
				// const todoList = that.todoSort(data)
				that.setState({ 
					todoList: data
				});
  			},
  			error: err => {
				console.log(err);
			}
  		});
	}
	
	_onNewItem (newItem) {
		const that = this;
		$.ajax({
			url: '/addItem',
			type: 'post',
			dataType: 'json',
			data: newItem,
			success: data => {
				console.log(data);
				const todoList = that.todoSort(data);
				that.setState({ 
					todoList 
				});
			},
			error: err => {
				console.log(err);
			}
		})
	}


	_onDeleteItem (date) {
		const that = this;
		const postData = { 
			date: date 
		};
		$.ajax({
			url: '/deleteItem',
			type: 'post',
			dataType: 'json',
			data: postData,
			success: data => {
				console.log(data);
				this._getTodoList();
			},
			error: err => {
				console.log(err);
			}
		})
	}
	
	todoSort (todoList) {
		todoList.reverse();
		return todoList;
	}

	handleSubmit(event){

		event.preventDefault();
		if(this.refs.content.value == "") {
			this.refs.content.focus();
			this.setState({
				showTooltip: true
			});
			return ;
		}

		let month = new Date().getMonth() + 1;
		let date = new Date().getDate();
		let hours = new Date().getHours();
		let minutes = new Date().getMinutes();
		let seconds = new Date().getSeconds();

		if (hours < 10) { hours += '0'; }
		if (minutes < 10) { minutes += '0'; }
		if (seconds < 10) { seconds += '0'; }

		const newItem={
			content: this.refs.content.value,
			date: month + "/" + date + " " + hours + ":" + minutes + ":" + seconds
		};

		console.log(newItem);
		this._onNewItem(newItem)
		this.refs.todoForm.reset();
		this.setState({
			showTooltip: false,
		});
	}

  	render() {
	  	return (
	  		<div className="container">
				<h2 className="header">Todo List</h2>
				<form className="todoForm" ref="todoForm" onSubmit={ this.handleSubmit.bind(this) }>
					<input ref="content" type="text" placeholder="Type content here..." className="todoContent" />
					{ this.state.showTooltip &&
						<span className="tooltip">Content is required !</span>
					}
				</form>
				<TodoList todoList={this.state.todoList} onDeleteItem={this._onDeleteItem.bind(this)} />
	  		</div>
  		)
  	}
}

export default Todo;
