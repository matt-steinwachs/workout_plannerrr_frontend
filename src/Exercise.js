import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';

import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

import ExerciseForm from './ExerciseForm';

class Exercise extends React.Component {
  state = {
    showForm: false
  };

  render() {
    const exercise = this.props.exercise;
    const references = this.props.references;

    return (
      <ListItem divider>
        {this.state.showForm ?
          <ExerciseForm
            exercise={exercise}
            references={references}
            onSubmit={async (body) => {
              await this.props.updateExercise(body);
              this.setState({showForm:false})
            }}
            onClose={() => {this.setState({showForm:false})}}
          />
          :
          <React.Fragment>
            <ListItemText
              style={{whiteSpace: 'normal'}}
              primary={exercise.name}
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

export default Exercise;
