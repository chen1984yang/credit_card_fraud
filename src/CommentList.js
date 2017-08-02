import React, { Component } from 'react';
import Comment from './Comment';
import style from './style';

class CommentList extends Component {
  render() {
      /*
    let commentNodes = this.props.data.map(comment => {
      return (
        <Comment
          author={ comment.name }
          uniqueID={ comment.id }
          onCommentDelete={ this.props.onCommentDelete }
          onCommentUpdate={ this.props.onCommentUpdate }
          key={ comment.id }>
          { comment.text }
        </Comment>
      )
    })
    return (
      <div style={ style.commentList }>
        { commentNodes }
      </div>
    )*/
    return (
      <div>
      </div>
      )
  }
}

export default CommentList;
