import React, {useState, useMemo, Fragment} from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import createDecorator from 'final-form-calculate';
import { TextField, Autocomplete } from 'mui-rff';
import { MenuItem, IconButton, Button, Box, Grid, Typography, Switch, FormControlLabel, Chip} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon, Timer as TimerIcon } from '@material-ui/icons';
import moment from 'moment';
import Timer from './Timer';

export default function WorkoutForm({workout, cycle, cycle_template, exercises, workout_templates, onSubmit, onClose}) {
  const initVal = workout ? {
    id: workout.id,
    workout: {
      id: workout.id,
      name: workout.name,
      cycle_id: workout.cycle_id,
      start: workout.start,
      blocks_attributes: workout.blocks.map(b => ({
        id: b.id,
        exercise_id: b.exercise_id,
        rounds_attributes: JSON.parse(JSON.stringify(b.rounds))
      }))
    }
  } : workout

  const calculator = useMemo(() => createDecorator(
    {
      field: "workout.workout_template_id",
      updates: (value, name, allValues) => {
        allValues.workout.name = workout_templates.find(wt => wt.id == value).name
        return allValues
      }
    }
  ), [])


  const [showAllWorkouts, setShowAllWorkouts] = useState(false);
  // const [now, setNow] = useState(moment());

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initVal}
      decorators={[calculator]}
      mutators={{
        ...arrayMutators
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {!values.id ?
              <Fragment>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    name="workout.workout_template_id"
                    label="Workout Template"
                    required={true}
                    options={showAllWorkouts ?
                      workout_templates
                      :
                      workout_templates.filter(wt => wt.cycle_template_id == cycle_template.id).filter(wt => (
                        !cycle.workouts.map(w => w.workout_template_id).includes(wt.id)
                      ))
                    }
                    getOptionValue={option => option.id}
                    getOptionLabel={option => option.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="workout.name"
                    label="Name"
                    placeholder="Workout Name"
                    required={true}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAllWorkouts}
                        onChange={() => setShowAllWorkouts(!showAllWorkouts)}
                        name="show_all"
                        label="Show All Workouts"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    }
                    label={showAllWorkouts ? "Show remaining workouts in cycle": "Show all workouts"}
                  />
                </Grid>

              </Fragment>
              :
              <Fragment>
                <Grid item xs={12} style={{display:"flex", alignItems:"center"}}>
                  <Box display="inline-block" ml={2} mt={1}>
                    <Typography component="h4" variant="h6" color="inherit" noWrap>Current Workout: {values.workout.name}</Typography>
                  </Box>
                  <Box display="inline-block" ml={2} mt={1}>
                    <Timer start={values.workout.start} />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FieldArray name="workout.blocks_attributes">
                    {({ fields }) => (
                      <Box ml={3}>
                        {fields.map((name, index) => {
                          let b = values.workout.blocks_attributes[index];
                          return (
                            <Box key={index} mb={2}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Typography component="h4" variant="h6" color="inherit" noWrap>
                                    {exercises.find(e => e.id == values.workout.blocks_attributes[index].exercise_id).name}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                  <FieldArray name={`${name}.rounds_attributes`}>
                                    {({ fields }) => (
                                      <Box ml={3}>
                                        {fields.map((name, index) => {
                                          let a = b.rounds_attributes[index];
                                          return (
                                            <Box key={index} mb={2}>
                                              <Grid container spacing={3}>
                                                <Grid item xs={2}>
                                                  <TextField
                                                    name={`${name}.reps`}
                                                    label="Reps"
                                                    placeholder="Reps"
                                                    size="small"
                                                    required={true}
                                                  />
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <TextField
                                                    name={`${name}.sets`}
                                                    label="Sets"
                                                    placeholder="Sets"
                                                    size="small"
                                                    required={true}
                                                  />
                                                </Grid>
                                                {a.weight != null &&
                                                  <Grid item xs={2}>
                                                    <TextField
                                                      name={`${name}.weight`}
                                                      label="Weight"
                                                      placeholder="Weight"
                                                      size="small"
                                                    />
                                                  </Grid>
                                                }
                                              </Grid>
                                            </Box>
                                          )
                                        })}
                                      </Box>
                                    )}
                                  </FieldArray>
                                </Grid>

                              </Grid>
                            </Box>
                          )
                        })}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
              </Fragment>
            }

            <Grid item xs={12} md={12} lg={12}>
              {values.id ?
                <Box component="span">
                  <Button variant="contained" color="secondary" size="small" type="submit" disabled={submitting}>
                    End Workout
                  </Button>
                </Box>
                :
                <Fragment>
                  <Box component="span">
                    <Button variant="contained" color="primary" size="small" type="submit" disabled={submitting || pristine}>
                      Start Workout
                    </Button>
                  </Box>
                  <Box component="span" ml={1}>
                    <Button  type="button" variant="contained" color="secondary" size="small" onClick={onClose}>
                      Cancel
                    </Button>
                  </Box>
                </Fragment>
              }
            </Grid>
          </Grid>
        </form>
      )}
    />
  )
}
