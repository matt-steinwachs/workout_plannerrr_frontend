import React, { Component, Fragment } from 'react';
import {
  Typography,
  Button,
  List,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { Add as AddIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import WorkoutTemplate from './WorkoutTemplate';
import WorkoutTemplateForm from './WorkoutTemplateForm';
import BlockTemplate from './BlockTemplate';


import withStyles from '@material-ui/core/styles/withStyles';


const styles = theme => ({
  full_width: {
    width: "100%"
  },
  align_center:{
    display: "flex",
    alignItems: "center"
  },
  cycle_list: {
    maxHeight: "50vh",
    overflowY: "scroll"
  }
});


class WorkoutTemplates extends Component {
  constructor(props){
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      error: null,
      adding: false,
      showing: false,
      editing: false,
      selected_id: null,
      open_cats: []
    };
  }

  async onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const {workout_templates, reorder} = this.props;
    const w_id = parseInt(result.draggableId.split("-")[1]);
    const rdi = result.destination.index;
    const rsi = result.source.index;
    let ct_id = workout_templates.find(w => w.id == w_id).cycle_template_id;

    let to_update = [{id: w_id, order: rdi}];
    workout_templates.filter(w =>
      w.id != w_id && w.cycle_template_id == ct_id
    ).forEach((w,i) => {
      if (rsi < rdi){
        if (w.order <= rdi && w.order > rsi)
          to_update.push({id: w.id, order: w.order-1});
      } else {
        if (w.order >= rdi && w.order < rsi)
          to_update.push({id: w.id, order: w.order+1});
      }
    });

    await reorder({workout_templates: to_update});
  }


  render(){
    const {classes, workout_templates, exercises, cycle_templates, add, update, destroy} = this.props;
    const {adding, showing, editing, selected_id, open_cats} = this.state;
    const selected = workout_templates.find(wt => (wt.id == selected_id));

    return(
      adding ?
        <Fragment>
          <Typography className={classes.align_center} component="h2" variant="h5" color="inherit" noWrap>
            <FitnessCenterIcon fontSize="large"/>Adding Workout Template
          </Typography>
          <WorkoutTemplateForm
            exercises={exercises}
            cycle_templates={cycle_templates}
            onSubmit={async (body) => {
              await add(body);
              this.setState({adding:false});
            }}
            onClose={() => {this.setState({adding:false})}}
          />
        </Fragment>
      : editing ?
        <Fragment>
          <Typography className={classes.align_center} component="h2" variant="h5" color="inherit" noWrap>
            <FitnessCenterIcon fontSize="large"/>Editing: {selected.name}
          </Typography>
          <WorkoutTemplateForm
            workout_template={selected}
            exercises={exercises}
            cycle_templates={cycle_templates}
            onSubmit={async (body) => {
              await update(body);
              this.setState({editing:false});
            }}
            onClose={() => {this.setState({editing:false})}}
          />
        </Fragment>
      : showing ?
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.align_center} component="h2" variant="h5" color="inherit" noWrap>
              <FitnessCenterIcon fontSize="large"/>Viewing: {selected.name}
            </Typography>
          </Grid>
          {selected.block_templates.map(b =>
            <Grid item xs={12} md={6} lg={4} key={b.id} >
              <BlockTemplate block_template={b} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              onClick={() => {this.setState({showing:false})}}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      :
        <Grid container>
          <Grid item xs={12}>
            <Typography  className={classes.align_center} component="h2" variant="h5" color="inherit" noWrap>
              <FitnessCenterIcon fontSize="large"/>Workout Templates
            </Typography>
            {cycle_templates.map(ct => {
              if (workout_templates.filter(wt => wt.cycle_template_id == ct.id).length > 0){
                return(
                  <Box mb={1} key={ct.id}>
                    <Accordion
                      expanded={open_cats.includes(ct.name)}
                      onChange={(e, isExpanded) => {
                        this.setState(prevState => {
                          if (isExpanded){
                            if (prevState.open_cats.findIndex(c => c == ct.name) == -1)
                              prevState.open_cats.push(ct.name);
                          } else {
                            prevState.open_cats.splice(prevState.open_cats.findIndex(c => c == ct.name),1)
                          }
                          return prevState;
                        })
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography variant="h6" color="inherit" noWrap>{ct.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{width:"100%"}}
                              >
                                <List className={classes.full_width}>
                                  {workout_templates.filter(wt => wt.cycle_template_id == ct.id).sort((a,b) => a.order - b.order).map((w,i) =>
                                    <Draggable key={w.id} draggableId={"w-"+w.id} index={i}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <WorkoutTemplate
                                            workout_template={w}
                                            key={w.id}
                                            show={() => {
                                              this.setState({showing: true, selected_id: w.id})}
                                            }
                                            edit={() => {
                                              this.setState({editing: true, selected_id: w.id})}
                                            }
                                            destroy={() => {destroy(w)}}
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  )}
                                  {provided.placeholder}
                                </List>
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )
              } else {
                return null
              }
            })}
            {workout_templates.filter(wt => wt.cycle_template_id == null).length > 0 &&
              <Box mb={1}>
                <Accordion
                  expanded={open_cats.includes("Uncategorized")}
                  onChange={(e, isExpanded) => {
                    this.setState(prevState => {
                      if (isExpanded){
                        if (prevState.open_cats.findIndex(c => c == "Uncategorized") == -1)
                          prevState.open_cats.push("Uncategorized");
                      } else {
                        prevState.open_cats.splice(prevState.open_cats.findIndex(c => c == "Uncategorized"),1)
                      }
                      return prevState;
                    })
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="h6" color="inherit" noWrap>Uncategorized</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List className={classes.full_width}>
                      {workout_templates.filter(wt => wt.cycle_template_id == null).map((w) =>
                        <WorkoutTemplate
                          workout_template={w}
                          key={w.id}
                          show={() => {
                            this.setState({showing: true, selected_id: w.id})}
                          }
                          edit={() => {
                            this.setState({editing: true, selected_id: w.id})}
                          }
                          destroy={() => {destroy(w)}}
                        />
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Box>
            }
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              onClick={() => {this.setState({adding:true})}}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
    )
  }
}

export default withStyles(styles)(WorkoutTemplates);
