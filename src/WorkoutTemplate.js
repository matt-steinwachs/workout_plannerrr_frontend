import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';

export default function WorkoutTemplate({workout_template, show, edit, destroy}) {
  return (
    <ListItem divider>
      <ListItemText
        primary={workout_template.name}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="show" onClick={show}>
          <VisibilityIcon />
        </IconButton>
        <IconButton edge="end" aria-label="edit" onClick={edit}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={destroy}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
