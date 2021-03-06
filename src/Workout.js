import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Chip, Box, Typography} from '@material-ui/core';
import { Delete as DeleteIcon, Timer as TimerIcon, Edit as EditIcon } from '@material-ui/icons';
import moment from 'moment';

import Block from './Block';

const useStyles = makeStyles({
  pull_right: {
    float: "right"
  }
});

export default function Workout({workout, cycle, deleteWorkout, close, edit}) {
  const classes = useStyles();
  return (
    <Grid container>
      {close &&
        <Grid item xs={2}>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={close}
            >
              Back
            </Button>
          </Box>
        </Grid>
      }

      <Grid item xs={close ? 6 : 10}>
        <Box ml={2} mt={2}>
          <Chip icon={<TimerIcon />} label={moment.utc(moment(workout.end).diff(moment(workout.start))).format("HH:mm:ss")} />
        </Box>
      </Grid>

      <Grid item xs={2}>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={edit}
          >
            <EditIcon />
          </Button>
        </Box>
      </Grid>

      {deleteWorkout &&
        <Grid item xs={2}>
          <Box mt={2} className={classes.pull_right}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={async () => {
                if (window.confirm("Are you sure?")){
                  let ccopy = JSON.parse(JSON.stringify(cycle));
                  ccopy.workouts.find(w => w.id == workout.id)._destroy = 1;
                  ccopy.workouts_attributes = ccopy.workouts;
                  delete ccopy.workouts;
                  ccopy.workouts_attributes.forEach(w => {
                    w.blocks_attributes = w.blocks;
                    delete w.blocks;
                    w.blocks_attributes.forEach(b => {
                      b.rounds_attributes = b.rounds;
                      delete b.rounds;
                    });
                  })
                  await deleteWorkout(ccopy);
                  close();
                }
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </Grid>
      }

      {workout.blocks.map(b =>
        <Grid item xs={12} md={6} lg={4} key={b.id} >
          <Block block={b} references={cycle.references} />
        </Grid>
      )}

      {(workout.notes != null && workout.notes != "") &&
        <Grid item xs={12}>
          <Box p={2}>
            <Typography component="h2" variant="h6" color="inherit">
              Notes:
            </Typography>
            <Typography component="p" variant="body1" color="inherit">
              {workout.notes}
            </Typography>
          </Box>
        </Grid>
      }
    </Grid>
  )
}
