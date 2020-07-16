import React from 'react'
import { Form } from 'react-final-form'
import { TextField, Select } from 'mui-rff';
import { MenuItem, Button, Box, Grid} from '@material-ui/core';



export default function ExerciseForm({exercise, references, onSubmit, onClose}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={exercise}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                name="name"
                label="Name"
                placeholder="Exercise Name"
                required={true}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Select name="reference_id" label="Reference" required={true}>
                {references.map(ml => (
                  <MenuItem key={ml.id} value={ml.id}>{ml.name}</MenuItem>
                ))}
              </Select>
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
