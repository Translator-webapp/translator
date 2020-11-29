import React from 'react'
import Input from './input'
import './message.css'
import {getAllMessages, postAMessage} from '../../store/message'
import {connect} from 'react-redux'
import Loader from 'react-loader-spinner'
import socket from '../../socket'

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    let selected = this.props.selected
    this.props.getAllMessages(this.props.userId, selected)
  }
  componentDidUpdate(prevProps) {
    console.log('prevProps', prevProps)
    if (this.props.selected !== prevProps.selected) {
      this.props.getAllMessages(this.props.userId, this.props.selected)
    }
  }
  handleChange(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(
      'message',
      this.state.value,
      'is type of',
      typeof this.state.value,
      'sender',
      this.props.userId,
      'receiver',
      this.props.selected
    )
    this.props.postAMessage(
      this.state.value,
      this.props.userId,
      this.props.selected
    )
    this.setState({
      value: ''
    })
  }
  render() {
    if (this.props.loading == true) {
      return (
        <div>
          <p>Loading messages...Please wait</p>
          <Loader type="Rings" color="#00BFFF" height={80} width={80} />
        </div>
      )
    }
    return (
      <ul className="list">
        {this.props.messages.map(message => {
          return (
            <li
              key={message.id}
              className={
                'messages' +
                (message.receiverId == this.props.userId
                  ? 'receiver'
                  : 'sender')
              }
            >
              {message.text}
            </li>
          )
        })}
        <li>
          <Input
            handleSubmit={this.handleSubmit}
            handleChange={this.handleChange}
            value={this.state.value}
          />
        </li>
      </ul>
    )
  }
}
const mapState = state => {
  return {
    userId: state.user.id,
    messages: state.message.messages,
    loading: state.message.loading
  }
}

const mapDispatch = dispatch => {
  return {
    getAllMessages: (id, otherId) => dispatch(getAllMessages(id, otherId)),
    postAMessage: (text, senderId, receiverId) =>
      dispatch(postAMessage(text, senderId, receiverId))
  }
}
export default connect(mapState, mapDispatch)(Messages)
