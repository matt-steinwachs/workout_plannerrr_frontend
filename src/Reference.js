import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import ReferenceForm from './ReferenceForm';

class Reference extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showForm: false
    };
  }

  render(){
    const reference = this.props.reference;
    return (
      <ListItem divider>
        {this.state.showForm ?
          <ReferenceForm
            reference={reference}
            onSubmit={async (body) => {
              await this.props.updateReference(body);
              this.setState({showForm:false})
            }}
            onClose={() => {this.setState({showForm:false})}}
          />
          :
          <React.Fragment>
            <ListItemText
              primary={reference.name}
              secondary={reference.value}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => {this.setState({showForm:true})}}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={this.props.onDelete}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </React.Fragment>
        }
      </ListItem>
    )
  }
}

export default Reference;
