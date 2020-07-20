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

export default function Block({block, references}) {
  const classes = useStyles();

  const no_weights = block.rounds.filter(rt => rt.weight).length > 0;

  const reference = references.find(ref => ref.id == block.exercise.reference_id)

  return (
    <TableContainer component={Box} p={2}>
      <Typography component="h2" variant="h5" color="inherit">
        {block.exercise.name}
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
          {block.rounds.map((r) => {
            const percent = Math.floor(r.weight/(reference.value)*100);
            return (
              <TableRow key={r.id}>
                {no_weights &&
                  <TableCell component="th" scope="row">
                    {r.weight} ({percent}%)
                  </TableCell>
                }

                <TableCell>{r.reps}</TableCell>
                <TableCell>{r.sets}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
