import React, { Component, Fragment } from "react";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import moment from 'moment';

import {Button, Grid, Typography, Box} from '@material-ui/core';
import { Add as AddIcon, PlayArrow as PlayIcon, Settings as SettingsIcon} from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import EventNoteIcon from '@material-ui/icons/EventNote';

import CycleForm from './CycleForm';
import WorkoutForm from './WorkoutForm';
import Workout from './Workout';
import Cycle from './Cycle';



const style = theme => ({
  top_buttons: {
    marginBottom: theme.spacing(2)
  },
  bottom_buttons:{
    marginTop: theme.spacing(2)
  },
  pull_right: {
    float: "right"
  }
});

class Planner extends Component {
  constructor(props){
    super(props);

    this.selectWorkout = this.selectWorkout.bind(this);
    this.selectCycle = this.selectCycle.bind(this);

    this.state = {
      startingCycle: false,
      startingWorkout: false,
      showingWorkout: false,
      selectedWorkout: null,
      showingCycle: false,
      selectedCycle: null
    }
  }

  selectWorkout(cycle_id, workout_id){
    const workout = this.props.cycles.find(c =>
        c.id == cycle_id
      ).workouts.find(w => w.id == workout_id);

    this.setState({
      showingWorkout:true,
      selectedWorkout: workout
    });
  }

  selectCycle(cycle_id){
    const cycle = this.props.cycles.find(c =>
      c.id == cycle_id
    );

    this.setState({
      showingCycle:true,
      selectedCycle: cycle
    });
  }

  render() {
    const {
      cycles, cycle_templates, workout_templates, classes, exercises,
      endCurrentCycle, startCycle, startWorkout, endWorkout, deleteWorkout
    } = this.props;

    const {startingCycle, startingWorkout, showingWorkout, selectedWorkout, showingCycle} = this.state;

    const current_cycle = cycles.find(c => c.end === null);

    const current_cycle_template = cycle_templates.find(ct => current_cycle && ct.id === current_cycle.cycle_template_id);
    let events = [];
    cycles.forEach(c => {
        events.push({
          id: "c-"+c.id,
          date: c.start,
          title: "Cycle Start: "+c.name,
          allDay: true,
          color: "green"
        })
        events.push({
          id: "c-"+c.id,
          date: c.end,
          title: "Cycle End: "+c.name,
          allDay: true,
          color: "red"
        })
      c.workouts.forEach(w =>
        events.push({
          id: "c-"+c.id+"-w-"+w.id,
          start: w.start,
          end: w.end,
          title: w.name,
          color: "blue"
        })
      );
    });

    let current_workout = current_cycle && current_cycle.workouts.find(w => w.end === null);

    let selectedWorkoutCycle = showingWorkout &&
      cycles.find(c => c.id == selectedWorkout.cycle_id)
    ;

    let selectedCycle = this.state.selectedCycle || current_cycle;

    return (
      <div>
        <Grid className={classes.top_buttons} container>
          <Grid item xs={12}>
            <Typography style={{ display: 'flex', alignItems: 'center'}} component="h2" variant="h5" color="inherit" noWrap>
              <EventNoteIcon fontSize="large"/>
              {showingWorkout ?
                "Viewing Workout: "+selectedWorkout.name+" -- "+moment(selectedWorkout.start).format("LLLL")
                : startingCycle ? "New Cycle"
                : showingCycle ? "Viewing Cycle: "+selectedCycle.name
                : "Planner"
              }
            </Typography>
          </Grid>

          {
            showingWorkout ?
              <Workout
                workout={selectedWorkout}
                cycle={selectedWorkoutCycle}
                close={() => {this.setState({showingWorkout: false, selectedWorkout: null})}}
                delete={deleteWorkout}
              />
            : current_cycle != undefined ?
              <Grid container>
                {!showingCycle &&
                  <Grid item xs={12}>
                    <Typography component="h3" variant="h6" color="inherit" noWrap>Current Cycle: {current_cycle.name}</Typography>
                  </Grid>
                }
                {
                  current_workout !== undefined ?
                    <Grid item xs={12}>
                      <WorkoutForm
                        workout={current_workout}
                        cycle={current_cycle}
                        cycle_template={current_cycle_template}
                        exercises={exercises}
                        workout_templates={workout_templates}
                        onSubmit={async (body) => {
                          let cccopy = {
                            id: current_cycle.id,
                            cycle: JSON.parse(JSON.stringify(current_cycle))
                          };
                          cccopy.cycle.workouts_attributes = cccopy.cycle.workouts
                          delete cccopy.cycle.workouts;
                          const wai = cccopy.cycle.workouts_attributes.findIndex(wa => wa.id == body.id);
                          cccopy.cycle.workouts_attributes[wai] = body.workout;
                          cccopy.cycle.workouts_attributes[wai].end = moment();
                          await endWorkout(cccopy);
                          this.setState({startingWorkout: false});
                        }}
                        onClose={() => {this.setState({startingWorkout: false})}}
                      />
                    </Grid>
                  : startingWorkout ?
                    <Grid item xs={12}>
                      <WorkoutForm
                        cycle={current_cycle}
                        cycle_template={current_cycle_template}
                        exercises={exercises}
                        workout_templates={workout_templates}
                        onSubmit={async (body) => {
                          let cccopy = {
                            id: current_cycle.id,
                            cycle: JSON.parse(JSON.stringify(current_cycle))
                          };
                          cccopy.cycle.workouts_attributes = cccopy.cycle.workouts
                          cccopy.cycle.workouts_attributes.push(body.workout);
                          delete cccopy.cycle.workouts;
                          await startWorkout(cccopy);
                          this.setState({startingWorkout: false});
                        }}
                        onClose={() => {this.setState({startingWorkout: false})}}
                      />
                    </Grid>
                  : showingCycle ?
                    <Cycle
                      cycle={selectedCycle}
                      isCurrentCycle={selectedCycle.id == current_cycle.id}
                      workout_templates={workout_templates}
                      close={() => {this.setState({showingCycle: false, selectedCycle: null})}}
                      endCurrentCycle={endCurrentCycle}
                      deleteCycle={() => {}}
                    />
                  :
                    <Fragment>
                      <Grid item xs={12}>
                        <Box display="inline-block" mt={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {this.setState({startingWorkout: true})}}
                          >
                            <AddIcon />
                            Start Workout
                          </Button>
                        </Box>
                        <Box display="inline-block" ml={3} mt={2} className={classes.pull_right}>
                          <Button
                            variant="contained"
                            onClick={() => {this.setState({showingCycle:true})}}
                          >
                            <SettingsIcon />
                          </Button>
                        </Box>
                      </Grid>

                    </Fragment>
                }
              </Grid>
            :
              <Grid item xs={12}>
                {startingCycle ?
                  <CycleForm
                    cycle_templates={cycle_templates}
                    onSubmit={async (body) => {
                      await startCycle(body);
                      this.setState({startingCycle: false});
                    }}
                    onClose={() => {this.setState({startingCycle: false})}}
                  />
                  :
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {this.setState({startingCycle: true})}}
                  >
                    <PlayIcon />
                    Start Cycle
                  </Button>
                }
              </Grid>

          }
        </Grid>

        {!startingCycle && !startingWorkout && current_workout === undefined && !showingWorkout && !showingCycle &&
          <FullCalendar
            plugins={[ dayGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={(e) => {
              let id_parts = e.event._def.publicId.split('-');
              if (id_parts.length > 2){
                let cycle_id = id_parts[1];
                let workout_id = id_parts[3];
                this.selectWorkout(cycle_id, workout_id);
              } else {
                let cycle_id = id_parts[1];
                this.selectCycle(cycle_id);
              }
            }}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,listMonth'
            }}
            height="70vh"
          />
        }
      </div>
    );
  }
}

export default withStyles(style)(Planner);
