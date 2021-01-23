import React, { Component } from 'react';
import { Typography, Button, List } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Add as AddIcon, Explicit as ExplicitIcon } from '@material-ui/icons';

import Exercise from './Exercise';
import ExerciseForm from './ExerciseForm';

const styles = theme => ({
  fixedHeight: {
    overflowY: "scroll",
    maxHeight: 480,
    marginBottom: 25
  },
  align_center:{
    display: "flex",
    alignItems: "center"
  }
});

class Exercises extends Component {
  constructor(props){
    super(props);

    this.state = {
      adding: false
    };
  }

  render(){
    const {
      classes,
      exercises, references,
      updateExercise, deleteExercise, addExercise
    } = this.props;

    return(
      this.state.loading ? <p>Loading</p> :
        <div>
          <Typography className={classes.align_center} component="h2" variant="h5" color="inherit" noWrap>
            <ExplicitIcon fontSize="large" /> Exercises
          </Typography>
          <List className={classes.fixedHeight}>
            {
              exercises.sort((a,b) => (
                a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : 0
              ).map((e) =>
                <Exercise
                  exercise={e}
                  references={references}
                  updateExercise={updateExercise}
                  onDelete={() => {if (window.confirm("Are you sure?")) deleteExercise(e);}}
                  key={e.id}
                />
              )
            }
          </List>
          {this.state.adding ?
            <ExerciseForm
              references={references}
              onSubmit={async (body) => {
                await addExercise(body);
                this.setState({adding:false})
              }}
              onClose={() => {this.setState({adding:false})}}
            />
            :
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              onClick={() => {this.setState({adding:true})}}
            >
              <AddIcon />
            </Button>
          }

        </div>
    )
  }
}

export default withStyles(styles)(Exercises);
