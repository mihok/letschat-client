const module = module || {};
module.exports = (function (w) {

  // Libraries

  const MnmlChat = w.MnmlChat || {};
  const React = w.React || false;
  const Redux = w.Redux || false;
  const ReactDOM = w.ReactDOM || false;
  const ReactRedux = w.ReactRedux || false;
  const ReactJSS = w.reactJss || false;
  // const $ = w.jQuery || false;
  const io = w.io || false;
  const socketPath = 'http://localhost:8000';
  // let socket;


  // Constants

  // KeyCode Constants
  const KEY_ENTER = 13;

  // React Constants
  const UI_OPEN = 'UI_OPEN';
  const UI_CLOSE = 'UI_CLOSE';
  const UI_SOFT_ENTER = 'UI_SOFT_ENTER';
  const UI_HARD_ENTER = 'UI_HARD_ENTER';
  const UI_STYLE_MESSANGER = 'UI_STYLE_MESSANGER';
  const UI_STYLE_FLOAT = 'UI_STYLE_FLOAT';
  const UI_STYLE_SIDEBAR = 'UI_STYLE_SIDEBAR';

  const CHAT_CONNECTED = 'CHAT_CONNECTED';
  const CHAT_DISCONNECTED = 'CHAT_DISCONNECTED';
  const CHAT_MESSAGE_CLIENT = 'CHAT_MESSAGE_CLIENT';
  const CHAT_MESSAGE_OPERATOR = 'CHAT_MESSAGE_OPERATOR';

  const CHAT_CLIENT = 'CLIENT';
  const CHAT_OPERATOR = 'OPERATOR';


  // State
  const { combineReducers, createStore } = Redux;
  const { connect } = ReactRedux;

  // UI based actions (open, close)  will go through the uiReducer
  const uiInitialState = {
    style: 'sidepanel'
  };
  const uiReducer = function UIReducer (state = uiInitialState, action) {
    console.log('UI', action.type);
    switch (action.type) {
      case UI_CLOSE:
        return Object.assign({}, state, {
          open: false
        });
      case UI_OPEN:
      default:
        return state;
    }
  };

  // Chat based actions (send, recieve) will go through the chatReducer
  const chatInitialState = {
    messages: []
  };
  const chatReducer = function ChatReducer (state = chatInitialState, action) {
    let messages = [];

    console.log('CHAT', action.type);

    switch (action.type) {
      case CHAT_MESSAGE_OPERATOR:
        messages = state.messages;

        // Is the last message from client? (e.g. can we combine it)
        if (messages.length > 0 && messages[messages.length-1].author == CHAT_OPERATOR) {
          messages[messages.length-1].content.push(action.message);
        } else {
          messages.push({
            author: CHAT_OPERATOR,
            content: [action.message]
          });
        }

        return Object.assign({}, state, {
          messages: messages
        })
      case CHAT_MESSAGE_CLIENT:
        messages = state.messages;

        // Is the last message from client? (e.g. can we combine it)
        if (messages.length > 0 && messages[messages.length-1].author == CHAT_CLIENT) {
          messages[messages.length-1].content.push(action.message);
        } else {
          messages.push({
            author: CHAT_CLIENT,
            content: [action.message]
          });
        }

        return Object.assign({}, state, {
          messages: messages
        })
      default:
        return state;
    }
  }

  let store = document.store = createStore(
    combineReducers({
      ui: uiReducer,
      chat: chatReducer
    })
  );


  // Styles
  const styles = {
    popup: {
      Message: {
        operatorPicture: {
          width: '48px',
          height: '48px',
          float: 'right',
          marginTop: '4px',
          boxSizing: 'border-box',
          padding: '0 4px'
        },
        operatorPictureImage: {
          width: '40px',
          height: '40px'
        },
        operatorContent: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          width: '160px',
          marginTop: '4px',
          marginBottom: '4px',
          borderRadius: '10px 0 10px 10px',
          padding: '6px',
          background: '#e1e1e1',
          float: 'right',
          textAlign: 'right'
        },
        userContent: {
          margin: 0,
          listStyle: 'none',
          width: '160px',
          float: 'left',
          textAlign: 'left',
          background: '#0a6bef',
          marginTop: '0',
          marginLeft: '4px',
          borderRadius: '10px 10px 10px 0',
          padding: '6px',
          color: 'white'
        }
      },
      MessageList: {
        messages: {
          position: 'absolute',
          top: '32px',
          bottom: '48px',
          left: 0,
          right: 0,
          paddingTop: '6px',
          overflowY: 'scroll',
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box'
        },
        messagesWrapper: {
          position: 'relative',
          height: '100%'
        },
        messagesList: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          width: '100%'
        }
      },
      Input: {
        input: {
          position:' absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '48px',
          boxSizing: 'border-box',
          border: 0,
          borderRight: '1px solid #ccc',
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff',
          padding: '8px',
          color: '#222',
          fontSize: '11px',
          resize: 'none',
          outline: 0
        }
      },
      Chat: {
        innerWrapper: {
          display: 'block',
          width: '280px',
          height: '360px',
          boxShadow: '#dddddd 1px 1px 8px 0',
          borderWidth: '0 1px 1px 0',
          borderRadius: '3px 3px 0 0',
          borderStyle: 'solid',
          borderColor: '#cccccc',
          borderBottom: 0
        },
        outerWrapper: {
          position: 'relative',
          width: '80%',
          margin: '0 auto'
        },
        box: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff'
        },
        header: {
          display: 'block',
          width: '100%',
          height: '32px',
          padding: '8px',
          boxSizing: 'border-box',
          borderRadius: '3px 3px 0 0',
          boxShadow: '0 1px 1px 0 rgba(0,0,0,0.15)',
          fontSize: '13px',
          fontFamily: '\'Arial\', sans-serif',
          color: 'white',
          background: '#ef7f7f'
        },
        icon: {
          float: 'right',
          fontSize: '24px',
          marginTop: '-5px',
          fontWeight: '800',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)'
        }
      }
    },
    float: {
      Message: {
        operatorPicture: {
          position: 'absolute',
          left: '-48px',
          width: '48px',
          height: '48px',
          float: 'right',
          marginTop: '-16px',
          boxSizing: 'border-box',
          padding: '0 4px'
        },
        operatorPictureImage: {
          width: '40px',
          height: '40px',
          borderRadius: '20px'
        },
        operatorContent: {
          margin: 0,
          listStyle: 'none',
          width: '160px',
          float: 'left',
          textAlign: 'left',
          background: '#ffffff',
          marginTop: '4px',
          marginLeft: '4px',
          boxShadow: '#dddddd 1px 1px 8px 0',
          borderRadius: '0 10px 10px 10px',
          padding: '16px',
        },
        userContent: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          width: '160px',
          marginTop: '4px',
          marginBottom: '4px',
          boxShadow: '#dddddd 1px 1px 8px 0',
          borderRadius: '10px 10px 0 10px',
          padding: '16px',
          background: '#0a6bef',
          float: 'right',
          textAlign: 'right',
          color: 'white'
        }
      },
      MessageList: {
        messages: {
          position: 'absolute',
          bottom: '48px',
          left: 0,
          right: 0,
          paddingTop: '6px',
          paddingBottom: '6px',
          boxSizing: 'border-box'
        },
        messagesWrapper: {
          position: 'relative',
          height: '100%'
        },
        messagesList: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          width: '100%'
        }
      },
      Input: {
        input: {
          position:' absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '48px',
          boxSizing: 'border-box',
          boxShadow: '#dddddd 1px 1px 8px 0',
          border: 0,
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '16px',
          color: '#222',
          fontSize: '13px',
          resize: 'none',
          outline: 0
        }
      },
      Chat: {
        innerWrapper: {
          display: 'block',
          width: '280px',
          height: '360px'
        },
        outerWrapper: {
          position: 'relative',
          width: '90%',
          margin: '0 auto'
        },
        box: {
          position: 'absolute',
          right: 0,
          bottom: '120px',
          backgroundColor: 'transparent'
        },
        header: {
          position: 'absolute',
          bottom: '-48px',
          right: '-48px',
          display: 'block',
          width: '42px',
          height: '42px',
          padding: '12px 10px 12px 11px',
          boxSizing: 'border-box',
          borderRadius: '21px',
          boxShadow: '#dddddd 1px 1px 8px 0',
          fontSize: '13px',
          fontFamily: '\'Arial\', sans-serif',
          color: 'white',
          background: '#ef7f7f'
        },
        headerText: {
          display: 'none'
        },
        icon: {
          float: 'right',
          fontSize: '24px',
          marginTop: '-5px',
          fontWeight: '800',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)'
        }
      }
    },
    sidepanel: {
      Message: {
        operatorPicture: {
          width: '48px',
          height: '48px',
          float: 'right',
          marginTop: '4px',
          boxSizing: 'border-box',
          padding: '0 4px'
        },
        operatorPictureImage: {
          width: '40px',
          height: '40px'
        },
        operatorContent: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          width: '160px',
          marginTop: '4px',
          marginBottom: '4px',
          borderRadius: '10px 0 10px 10px',
          padding: '6px',
          background: '#e1e1e1',
          float: 'right',
          textAlign: 'right'
        },
        userContent: {
          margin: 0,
          listStyle: 'none',
          width: '160px',
          float: 'left',
          textAlign: 'left',
          background: '#0a6bef',
          marginTop: '0',
          marginLeft: '4px',
          borderRadius: '10px 10px 10px 0',
          padding: '6px',
          color: 'white'
        }
      },
      MessageList: {
        messages: {
          position: 'absolute',
          top: '32px',
          bottom: '48px',
          left: 0,
          right: 0,
          paddingTop: '6px',
          overflowY: 'scroll',
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box'
        },
        messagesWrapper: {
          position: 'relative',
          height: '100%'
        },
        messagesList: {
          margin: 0,
          padding: 0,
          listStyle: 'none',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          width: '100%'
        }
      },
      Input: {
        input: {
          position:' absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '48px',
          boxSizing: 'border-box',
          border: 0,
          borderRight: '1px solid #ccc',
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff',
          padding: '8px',
          color: '#222',
          fontSize: '11px',
          resize: 'none',
          outline: 0
        }
      },
      Chat: {
        innerWrapper: {
          display: 'block',
          width: '280px',
          height: '360px',
          boxShadow: '#dddddd 1px 1px 8px 0',
          borderWidth: '0 1px 1px 0',
          borderRadius: '3px 3px 0 0',
          borderStyle: 'solid',
          borderColor: '#cccccc',
          borderBottom: 0
        },
        outerWrapper: {
          position: 'relative',
          width: '80%',
          margin: '0 auto'
        },
        box: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff'
        },
        header: {
          display: 'block',
          width: '100%',
          height: '32px',
          padding: '8px',
          boxSizing: 'border-box',
          borderRadius: '3px 3px 0 0',
          boxShadow: '0 1px 1px 0 rgba(0,0,0,0.15)',
          fontSize: '13px',
          fontFamily: '\'Arial\', sans-serif',
          color: 'white',
          background: '#ef7f7f'
        },
        icon: {
          float: 'right',
          fontSize: '24px',
          marginTop: '-5px',
          fontWeight: '800',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)'
        }
      }
    }
  };
  const style = function Style (component) {
    const state = store.getState();

    if (!styles.hasOwnProperty(state.ui.style)) {
      throw 'UnknownStyleError';
    }

    if (!styles[state.ui.style].hasOwnProperty(component)) {
      throw 'UnknownComponentStyleError';
    }

    console.log('CSS', styles[state.ui.style][component]);
    return styles[state.ui.style][component];
  }

  const injectSheet = ReactJSS.create();



  // React Components

  // class Notification extends React.Component {
  //   render () {
  //     return (
  //       <ul className="letschat-alert" style={{margin: 0, listStyle: 'none'}}>
  //       </ul>
  //     )
  //   }
  // }

  // class Status extends React.Component {
  //   constructor (props) {
  //     super(...arguments);

  //     this.socket = props.socket;
  //     this.socket.on('operator:typing', this.onTyping);

  //     this.state = {
  //       typing: false,
  //       style: {}
  //     };
  //   }

  //   onTyping () {
  //     console.log('OPERATOR TYPING ...');
  //   }

  //   render () {
  //     return (
  //         <ul className="letschat-message-status" style={{
  //           position: 'fixed',
  //           bottom: '48px',
  //           margin: 0,
  //           boxSizing: 'border-box',
  //           padding: '4px 8px',
  //           height: '24px',
  //           width: '265px',
  //           fontSize: '13px',
  //           fontFamily: 'sans-serif',
  //           fontStyle: 'italic',
  //           listStyle: 'none',
  //           color: '#D1D1D1'
  //         }}>
  //           <li><span>John is typing...</span></li>
  //         </ul>
  //       )
  //   }
  // }

  const Message = injectSheet(style('Message'))((props) => {
    let { sheet: { classes } } = props;

    let content = props.content.map((message, index) => {
      return (
          <li key={index}>{message}</li>
        )
    });

    let message = (
        <div>
          <ul className={classes.userContent}>
            {content}
          </ul>
        </div>
      );

    if (props.author == CHAT_OPERATOR) {
      message = (
        <div>
          <div className={classes.operatorPicture}>
            <img className={classes.operatorPictureImage} src="http://placehold.it/40x40/" />
          </div>
          <ul className={classes.operatorContent}>
            {content}
          </ul>
        </div>
      );
    }

    return (
      <li id={'message_'+props.id} className="letschat-message" style={{clear:'both'}}>
        {message}
        <span className="letschat-message-timestamp">{props.timestamp}</span>
      </li>
    )
  })

  const messageListMapStateToProps = state => {
    return {
      messages: state.messages || []
    };
  }
  const messageListMapDispatchToProps = dispatch => {
    return {

    };
  }

  const MessageList = injectSheet(style('MessageList'))((props) => {
    const state = store.getState();
    let { sheet: { classes } } = props;
    let socket = props.socket;

    let messages = state.chat.messages.map((message, index) => {
      return (
        <Message key={index} author={message.author} content={message.content}></Message>
      );
    });

    return (
      <div className={classes.messages}>
        <div className={classes.messagesWrapper}>
          <ul className={classes.messagesList}>
            {messages}
          </ul>
        </div>
      </div>
    )
          // <Notification />
          // <Status socket={socket} />
  })

  const Messages = connect(
    messageListMapStateToProps,
    messageListMapDispatchToProps
  )(MessageList);


  @injectSheet(style('Input'))
  class Input extends React.Component {
    constructor (props) {
      super(props);

      this.socket = props.socket;
    }


    // Event Handler

    onKeyPress (event) {
      let key = event.key;
      let keyCode = event.keyCode;
      let shiftKey = event.shiftKey;
      let ctrlKey = event.ctrlKey;
      let altKey = event.altKey;

      console.log('INPUT KEYPRESS', key, '(' + keyCode + ')', 'SHIFT', shiftKey, 'CTRL', ctrlKey, 'ALT', altKey);

      if (keyCode == KEY_ENTER) {
        if (!shiftKey) {
          console.log('SENDING MESSAGE ...');
          // Send data
          this.socket.emit('client:message', event.target.value);

          // Update message list
          store.dispatch({ type: UI_HARD_ENTER,  message: event.target.value });
          store.dispatch({ type: CHAT_MESSAGE_CLIENT, message: event.target.value });

          event.preventDefault();
          event.target.value = '';
        } else {
          // Update input height
          store.dispatch({ type: UI_SOFT_ENTER });
        }
      }

      this.socket.emit('client:typing');
    }


    render () {
      let { sheet: { classes } } = this.props;

      return <textarea
        type="text"
        className={classes.input}
        placeholder="Type a message&hellip;"
        onKeyDown={this.onKeyPress.bind(this)} />
    }
  }

  // Create chat box wrapper
  @injectSheet(style('Chat'))
  class Chat extends React.Component {
    constructor (props) {
      super(props);

      this.socket = io.connect(socketPath, {
        reconnectionAttempts: 10
      });

      this.socket.on('connect', this.onSocketConnected);
      this.socket.on('connect_error', this.onSocketConnectionError);
      this.socket.on('connect_timeout', this.onSocketTimeout);
      this.socket.on('disconnect', this.onSocketDisconnected);
      this.socket.on('reconnect', this.onSocketReconnected);
      this.socket.on('reconnecting', this.onSocketReconnecting);
      // this.socket.on('reconnect_error', socketConnectionError);
      this.socket.on('reconnect_failed', this.onSocketReconnectionFailed);
      this.socket.on('reconnect_timeout', this.onSocketTimeout);

      this.socket.on('operator:message', this.handleOperatorMessage);

      // Initial state
      this.state = {
        operator: {
          firstName: 'John'
        },
        company: {
          name: 'ACME'
        }
      };
    }


    // Event Handlers

    // Successful connection
    onSocketConnected () {
      const state = store.getState();
      console.log('DEBUG', 'Socket connected');

      if (!state.chat.connected) {
        store.dispatch({ type: CHAT_CONNECTED });
      }
    };

    // Disconnected
    onSocketDisconnected () {
      const state = store.getState();
      console.warn('DEBUG', 'Socket disconnected');

      if (state.chat.connected) {
        store.dispatch({ type: CHAT_DISCONNECTED });
      }
    };

    // Successful re-connected
    onSocketReconnected () {
      console.log('DEBUG', 'Socket reconnected');
    };

    // Attempting to re-connect
    onSocketReconnecting () {
      console.log('DEBUG', 'Socket reconnecting ...');
    };

    // Failed to re-connect after manager.reconnectionAttempts tried
    onSocketReconnectionFailed () {
      console.error('DEBUG', 'Socket failed reconnection');
    };

    // Timeout either connecting or re-connecting
    onSocketTimeout () {
      console.warn('DEBUG', 'Socket timeout');
    };

    // Error when connecting or re-connecting
    onSocketConnectionError () {
      console.error('DEBUG', 'Socket connection error');
    };

    handleOperatorMessage (data) {
      console.log('DEBUG', 'RECIEVING MESSAGE ...', data);

      store.dispatch({ type: CHAT_MESSAGE_OPERATOR, message: data });
    }


    // Actions

    open () {
      console.log('DEBUG', 'Open chat');
    }

    close () {
      console.log('DEBUG', 'Close chat');
    }


    render () {
      let { sheet: { classes } } = this.props;
      let socket = this.socket;
      let operator = this.state.operator;
      let company = this.state.company;

      return (
        <div className={classes.outerWrapper}>
          <div className={classes.box}>
            <div className={classes.innerWrapper}>
              <div className={classes.header}>
                <span className={classes.headerText}><strong>{operator.firstName}</strong>&nbsp;from&nbsp;{company.name}</span>
                <i className={classes.icon} onClick={this.close}>&#215;</i>
              </div>
              <Messages store={store} socket={socket} />
              <Input socket={socket} />
            </div>
          </div>
        </div>
      )
    }
  }


  // Init

  if (!React) {
    console.error('Required dependancy missing, React. https://facebook.github.io/react/downloads.html')
  }

  if (!Redux) {
    console.error('Required dependancy missing, Redux. http://redux.js.org/#installation')
  }

  if (!ReactDOM) {
    console.error('Required dependancy missing, ReactDOM. https://facebook.github.io/react/downloads.html')
  }

  if (!ReactRedux) {
    console.error('Required dependancy missing, ReactRedux. https://github.com/reactjs/react-redux#installation')
  }

  if (!io) {
    console.error('Required dependancy missing, Socket.io. http://socket.io/download/')
  }

  if (!React || !ReactDOM || !io) {
    return
  }

  // Our generic

  // stylesrender function
  const render = function render () {
    ReactDOM.render(
      <Chat store={store} />,
      document.getElementById('lets-chat')
    );
  };

  // Our render loop
  const unsubscribe = store.subscribe(() => {
    console.log('DEBUG', store.getState());
    render();
  });

  // Initiate the socket connection
  // socket = io.connect(socketPath, {
  //   reconnectionAttempts: 10
  // });

  // let styles = document.createElement('link');
  // styles.id = 'lets-chat-styles';
  // styles.rel = 'stylesheet';
  // styles.type = 'text/css';
  // styles.media = 'all';
  // styles.href = '/styles/lets-chat-syles-0.0.1.css';

  // Create our entry point
  let div = document.createElement('div');
  div.id = 'lets-chat';
  div.style.position = 'fixed';
  div.style.bottom = 0;
  div.style.right = 0;
  div.style.left = 0;

  document.body.appendChild(div);
  // document.body.insertBefore(styles, div);

  // Start by going into disconnected mode (and then connecting)
  store.dispatch({ type: CHAT_DISCONNECTED });

  return MnmlChat;
}) (window);
