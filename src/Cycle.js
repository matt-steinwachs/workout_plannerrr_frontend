import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Box, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  pull_right: {
    float: "right"
  }
});

export default function Cycle({cycle, isCurrentCycle, workout_templates, deleteCycle, endCurrentCycle, close}) {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={10}>
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
      {isCurrentCycle &&
        <Grid item xs={2}>
          <Button
            className={classes.pull_right}
            variant="contained"
            color="secondary"
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure?")){
                let cccopy = JSON.parse(JSON.stringify(cycle))
                cccopy.end = moment();
                endCurrentCycle(cccopy);
              }
            }}
          >
            End Cycle
          </Button>
        </Grid>
      }
      <Grid item xs={12}>
        <Box mt={2} ml={2}>
          <Typography  component="h3" color="inherit" noWrap>
            Started: {moment(cycle.start).format("LL")}
          </Typography>
        </Box>
      </Grid>

      { cycle.end &&
        <Grid item xs={12}>
          <Box mt={2} ml={2}>
            <Typography  component="h3" color="inherit" noWrap>
              Finished: {moment(cycle.end).format("LL")}
            </Typography>
          </Box>
        </Grid>
      }

      <Grid item xs={12}>
        <Box mt={2} ml={2}>
          <Typography  component="h3" color="inherit" noWrap>
            Completed Workouts: {cycle.workouts.length}
          </Typography>
        </Box>
      </Grid>

      { !cycle.end &&
        <Grid item xs={12}>
          <Box mt={2} ml={2}>
            <Typography  component="h3" color="inherit" noWrap>
              Workouts Remaining: {workout_templates.filter(w => w.cycle_template_id == cycle.cycle_template_id).length}
            </Typography>
          </Box>
        </Grid>
      }

      <Grid item xs={12}>
        <Box mt={2} ml={2}>
          { cycle.references.map(r => (
            <Typography  component="h4" color="inherit" noWrap>
              {r.name}: {r.value}
            </Typography>
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}
