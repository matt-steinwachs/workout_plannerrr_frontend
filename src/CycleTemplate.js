import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import CycleTemplateForm from './CycleTemplateForm';

class CycleTemplate extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showForm: false
    };
  }

  render(){
    const cycle_template = this.props.cycle_template;
    return (
      <ListItem divider>
        {this.state.showForm ?
          <CycleTemplateForm
            cycle_template={cycle_template}
            onSubmit={async (body) => {
              await this.props.updateCycleTemplate(body);
              this.setState({showForm:false})
            }}
            onClose={() => {this.setState({showForm:false})}}
          />
          :
          <React.Fragment>
            <ListItemText
              primary={cycle_template.name}
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

export default CycleTemplate;
