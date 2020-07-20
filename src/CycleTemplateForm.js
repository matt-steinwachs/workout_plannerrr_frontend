import React from 'react'
import { Form } from 'react-final-form'
import { TextField } from 'mui-rff';
import { Button, Box, Grid} from '@material-ui/core';

export default function CycleTemplateForm({cycle_template, onSubmit, onClose}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={cycle_template}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                placeholder="Cycle Name"
                required={true}
              />
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
