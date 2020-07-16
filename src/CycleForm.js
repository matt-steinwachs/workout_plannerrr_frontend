import React from 'react'
import { Form } from 'react-final-form'
import createDecorator from 'final-form-calculate'
import { TextField, Select } from 'mui-rff';
import { MenuItem, Button, Box, Grid, Typography} from '@material-ui/core';

export default function CycleForm({cycle, cycle_templates, onSubmit, onClose}) {
  const calculator = createDecorator(
    {
      field: 'cycle.cycle_template_id',
      updates: (value, name, allValues) => {
        allValues.cycle.name = cycle_templates.find(ct => ct.id == value).name
        return allValues
      }
    }
  )

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={cycle}
      decorators={[calculator]}

      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>


            <Grid item xs={12} md={6} lg={6}>
              <Select
                name="cycle.cycle_template_id" label="Cycle Template" required={true}
              >
                {cycle_templates.map(ct => (
                  <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <TextField
                name="cycle.name"
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
