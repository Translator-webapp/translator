import React, {Component} from 'react'
import {
  getAllMessages,
  postAMessage,
  translateOne,
  translateAll
} from '../../store/reducers/message'
import {connect} from 'react-redux'
import Loader from 'react-loader-spinner'
import socket from '../../socket'
import {Alert, Button, FormControl, InputGroup} from 'react-bootstrap'
import InputComp from './inputComp'

export class Msg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      showTrans: false,
      toggleMemes: false,
      translate: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.translate = this.translate.bind(this)
    this.toggleShowTrans = this.toggleShowTrans.bind(this)
    this.handleGIPHY = this.handleGIPHY.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentDidMount() {
    let selected = this.props.selected
    this.props.getAllMessages(this.props.userId, selected)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.props.getAllMessages(this.props.userId, this.props.selected)
      this.setState({
        value: '',
        toggleMemes: false,
        showTrans: false
      })
    }
    if (this.props.messages !== prevProps.messages) {
      this.props.translateAll(this.props.messages, this.props.user.language)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.translate !== nextProps.translate) {
      this.setState({
        translate: this.props.translate
      })
    }
  }
  handleChange(event) {
    this.setState({value: event.target.value})
    let bool = false
    event.target.value !== '' ? (bool = true) : (bool = false)
    socket.emit('user typing', {
      typerId: this.props.userId,
      receiverId: this.props.selected,
      isTyping: bool
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.postAMessage(
      this.state.value,
      this.props.userId,
      this.props.selected
    )
    this.setState({
      value: ''
    })
  }

  toggleShowTrans() {
    let {showTrans} = this.state
    this.setState({
      showTrans: !showTrans
    })
  }

  toggle() {
    this.setState(prevState => ({toggleMemes: !prevState.toggleMemes}))
  }
  // switch to the store
  async translate(text, lan, messageId) {
    try {
      this.props.translateOne(text, lan, messageId)
      let {showTrans} = this.state
      await this.setState({
        showTrans: !showTrans,
        translate: this.props.translate
      })
    } catch (err) {
      console.error(err)
    }
  }
  handleGIPHY(gif) {
    this.props.postAMessage(
      gif.downsized.url,
      this.props.userId,
      this.props.selected,
      true
    )
    this.toggle()
  }

  render() {
    if (this.props.loading) {
      return (
        <div>
          <p>Loading messages...Please wait</p>
          <Loader type="Rings" color="#00BFFF" height={80} width={80} />
        </div>
      )
    }

    const translated = this.props.translateall

    return (
      <div className="d-flex flex-column flex-grow-1">
        <Alert variant="info">{this.props.title}</Alert>
        <div className="flex-grow-1 overflow-auto">
          <div className="d-flex flex-column align-items-start justify-content-end ">
            {translated &&
              translated.translation &&
              translated.translation.map(message => {
                return (
                  <div
                    key={message.id}
                    style={{maxWidth: '80%'}}
                    className={`my-1 d-flex flex-column ${
                      message.receiverId === this.props.userId
                        ? 'align-items-start'
                        : 'align-self-end align-items-end'
                    }`}
                  >
                    {this.state.showTrans ? (
                      <div
                        className={
                          'messages' +
                          (message.receiverId === this.props.userId
                            ? 'receiver'
                            : 'sender')
                        }
                      >
                        {message.isImage ? (
                          <img src={message.text} />
                        ) : (
                          message.translation
                        )}
                      </div>
                    ) : (
                      <div
                        className={
                          'messages' +
                          (message.receiverId === this.props.userId
                            ? 'receiver'
                            : 'sender') +
                          (message.isImage ? 'img' : '')
                        }
                      >
                        {message.isImage ? (
                          <img src={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
        <InputComp
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          value={this.state.value}
          handleGIPHY={this.handleGIPHY}
          toggleMemes={this.state.toggleMemes}
          toggle={this.toggle}
          toggleShowTrans={this.toggleShowTrans}
        />
      </div>
    )
  }
}

const mapState = state => {
  return {
    userId: state.user.id,
    user: state.user,
    messages: state.message.messages,
    translate: state.message.translate,
    loading: state.message.loading,
    isTyping: state.message.isTyping,
    title: state.message.isTyping
      ? 'The other user is typing...'
      : 'Start your conversation',

    translateall: state.message.translateAll
  }
}

const mapDispatch = dispatch => {
  return {
    getAllMessages: (id, otherId) => dispatch(getAllMessages(id, otherId)),
    postAMessage: (text, senderId, receiverId, bool) =>
      dispatch(postAMessage(text, senderId, receiverId, bool)),
    translateOne: (text, lan, messageId) =>
      dispatch(translateOne(text, lan, messageId)),
    translateAll: (messages, language) =>
      dispatch(translateAll(messages, language))
  }
}
export default connect(mapState, mapDispatch)(Msg)