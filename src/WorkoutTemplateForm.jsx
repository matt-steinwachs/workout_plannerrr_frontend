import React, {useState} from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { TextField, Select, Autocomplete } from 'mui-rff';
import { MenuItem, IconButton, Button, Box, Grid, Typography} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';


export default function WorkoutTemplateForm({workout_template, exercises, cycle_templates, onSubmit, onClose}) {
  const initVal = workout_template ? {
    id: workout_template.id,
    workout_template: {
      id: workout_template.id,
      name: workout_template.name,
      cycle_template_id: workout_template.cycle_template_id,
      block_templates_attributes: workout_template.block_templates.map(bt => ({
        id: bt.id,
        exercise_id: bt.exercise_id,
        round_templates_attributes: bt.round_templates
      }))
    }
  } : workout_template

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initVal}
      mutators={{
        ...arrayMutators
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="workout_template.name"
                label="Name"
                placeholder="Workout Name"
                required={true}
              />
            </Grid>

            <Grid item xs={8}>
              <Select name="workout_template.cycle_template_id" label="Cycle">
                {cycle_templates.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <FieldArray name="workout_template.block_templates_attributes">
                {({ fields }) => (
                  <Box ml={3}>
                    {fields.map((name, index) => (
                      fields.value[index]._destroy != 1 &&
                      <Box key={index} mb={2}>
                        <Grid container spacing={3}>
                          <Grid item xs={9}>
                            <Autocomplete
                              name={`${name}.exercise_id`} label="Exercise" required={true}
                              options={exercises}
                              getOptionValue={option => option.id}
                              getOptionLabel={option => option.name}
                            />


                          </Grid>

                          <Grid item xs={1}>
                            <Box mt={2}>
                              <IconButton
                                type="button"
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => fields.update(index, {_destroy:1, ...fields.value[index]})}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <FieldArray name={`${name}.round_templates_attributes`}>
                              {({ fields }) => (
                                <Box ml={3}>
                                  {fields.map((name, index) => (
                                    fields.value[index]._destroy != 1 &&
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
                                        <Grid item xs={2}>
                                          <TextField
                                            name={`${name}.percent`}
                                            label="Percent"
                                            placeholder="Percent"
                                            size="small"
                                          />
                                        </Grid>
                                        <Grid item xs={2}>
                                          <TextField
                                            name={`${name}.weight`}
                                            label="Weight"
                                            placeholder="Weight"
                                            size="small"
                                          />
                                        </Grid>
                                        <Grid item xs={1}>
                                          <Box mt={2}>
                                            <IconButton
                                              type="button"
                                              variant="contained"
                                              color="secondary"
                                              size="small"
                                              onClick={() =>  (
                                                fields.update(index, {_destroy:1, ...fields.value[index]})
                                              )}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() => fields.push({})}
                                  >
                                    Add Round
                                  </Button>
                                </Box>
                              )}
                            </FieldArray>
                          </Grid>

                        </Grid>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => fields.push({})}
                    >
                      Add Exercise
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Box component="span">
                <Button variant="contained" color="primary" size="small" type="submit" disabled={submitting || pristine}>
                  Submit
                </Button>
              </Box>

              <Box component="span" ml={1}>
                <Button  type="button" variant="contained" color="secondary" size="small" onClick={onClose}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    />
  )
}
