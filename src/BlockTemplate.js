import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';

import {
  Typography
} from '@material-ui/core';

const useStyles = makeStyles({
  table: {
  },
});

export default function BlockTemplate({block_template}) {
  const classes = useStyles();

  const no_weights = block_template.round_templates.filter(rt => rt.percent || rt.weight).length > 0
  return (
    <TableContainer component={Box} p={2}>
      <Typography component="h2" variant="h5" color="inherit">
        {block_template.exercise.name}
      </Typography>


      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {no_weights && <TableCell>Weight</TableCell>}
            <TableCell>Reps</TableCell>
            <TableCell>Sets</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {block_template.round_templates.map((r) => (
            <TableRow key={r.id}>
              {no_weights &&
                <TableCell component="th" scope="row">
                  {r.percent ?
                    Math.round(r.percent * block_template.exercise.reference.value)
                    :
                    r.weight ? r.weight
                    :
                    null
                  }
                </TableCell>
              }

              <TableCell>{r.reps}</TableCell>
              <TableCell>{r.sets}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
