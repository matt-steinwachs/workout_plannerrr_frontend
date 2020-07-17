import React from 'react';
import clsx from 'clsx';
import {
  Drawer, Box, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText,
  Typography, Divider, IconButton, Container, Grid, Paper, Link
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PublishIcon from '@material-ui/icons/Publish';
import EventNoteIcon from '@material-ui/icons/EventNote';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import ExplicitIcon from '@material-ui/icons/Explicit';
import LoopIcon from '@material-ui/icons/Loop';
import SettingsIcon from '@material-ui/icons/Settings';

import withStyles from '@material-ui/core/styles/withStyles';

import References from './References';
import Exercises from './Exercises';
import WorkoutTemplates from './WorkoutTemplates';
import CycleTemplates from './CycleTemplates';
import Planner from './Planner';
import Settings from './Settings';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 480,
  },
});

const API = process.env.REACT_APP_API || 'http://localhost:3001/api/v1';

class App extends React.Component {
  constructor(props){
    super(props);

    this.updateRecord = this.updateRecord.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.reorderWorkoutTemplates = this.reorderWorkoutTemplates.bind(this);

    const panes = JSON.parse(window.localStorage.getItem("panes"));
    this.state = {
      drawerOpen: panes.drawerOpen,
      showExercises: panes.showExercises,
      showReferences: panes.showReferences,
      showWorkouts: panes.showWorkouts,
      showCycles: panes.showCycles,
      showPlanner: panes.showPlanner,
      showSettings: panes.showSettings,
      references: [],
      exercises: [],
      cycle_templates: [],
      cycles: [],
      workout_templates: []
    };
  }

  async getAll() {
    this.setState({
      loading: false,
      exercises: (await this.fetch('get', '/exercises')) || [],
      references: (await this.fetch('get', '/references')) || [],
      workout_templates: (await this.fetch('get', '/workout_templates')) || [],
      cycle_templates: (await this.fetch('get', '/cycle_templates')) || [],
      cycles: (await this.fetch('get', '/cycles')) || [],
    });
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);

      this.setState({ error });
    }
  }

  async reorderWorkoutTemplates(data){
    let resp = await this.fetch('post', `/workout_templates/reorder`, data) || null;
    this.setState({workout_templates:resp})
  }

  async updateRecord(record_name, body){
    let resp = await this.fetch('put', `/${record_name}/${body.id}`, body) || null;

    this.setState((prevState) => {
      const i = this.state[record_name].findIndex((r) => (r.id == resp.id));
      prevState[record_name][i] = resp;
      return prevState;
    })
  }

  async addRecord(record_name, body){
    let resp = await this.fetch('post', `/${record_name}/`, body) || null;

    this.setState((prevState) => {
      prevState.adding = false;
      if (prevState[record_name].findIndex(r => r.id == resp.id) == -1)
        prevState[record_name].push(resp);

      return prevState;
    })
  }

  async deleteRecord(record_name, body){
    await this.fetch('delete', `/${record_name}/${body.id}`);

    this.setState((prevState) => {
      const i = prevState[record_name].findIndex((r) => (r.id == body.id));
      if (i !== -1){
        prevState[record_name].splice(i,1);
      }

      return prevState;
    })
  }

  async getRecords(record_name) {
    const resp = (await this.fetch('get', `/${record_name}/`)) || []
    this.setState(prevState => {
      prevState[record_name] = resp;
      return prevState;
    });
  }

  render(){
    const {
      drawerOpen,
      showExercises, showReferences, showWorkouts, showCycles, showPlanner, showSettings,
      exercises, cycle_templates, references, workout_templates, cycles
    } = this.state;

    const { classes } = this.props;
    const md_full = showReferences || showCycles ? 8 : 12;
    const lg_full = showReferences || showCycles ? 9 : 12;


    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                this.setState({drawerOpen:true});
              }}
              className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Workout Plannerrr
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
          }}
          open={drawerOpen}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => {
              this.setState({drawerOpen:false});
            }}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button onClick={() => {this.setState({showPlanner:!showPlanner})}}>
              <ListItemIcon>
                <EventNoteIcon color={showPlanner ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Planner" />
            </ListItem>

            <ListItem button onClick={() => {this.setState({showReferences:!showReferences})}}>
              <ListItemIcon>
                <PublishIcon color={showReferences ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="References" />
            </ListItem>

            <ListItem button onClick={() => {this.setState({showCycles:!showCycles})}}>
              <ListItemIcon>
                <LoopIcon color={showCycles ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Cycles" />
            </ListItem>

            <ListItem button onClick={() => {this.setState({showWorkouts:!showWorkouts})}}>
              <ListItemIcon>
                <FitnessCenterIcon color={showWorkouts ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Workouts" />
            </ListItem>

            <ListItem button onClick={() => {this.setState({showExercises:!showExercises})}}>
              <ListItemIcon>
                <ExplicitIcon color={showExercises ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Exercises" />
            </ListItem>
            <ListItem button onClick={() => {this.setState({showSettings:!showSettings})}}>
              <ListItemIcon>
                <SettingsIcon color={showSettings ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={md_full} lg={lg_full}>
                {showPlanner &&
                  <Paper className={classes.paper}>
                    <Planner
                      cycles={cycles}
                      cycle_templates={cycle_templates}
                      workout_templates={workout_templates}
                      exercises={exercises}
                      endCurrentCycle={(body) => {this.updateRecord("cycles",body)}}
                      startCycle={(body) => {this.addRecord("cycles",body)}}
                      startWorkout={(body) => {
                        this.updateRecord("cycles",body)
                      }}
                      endWorkout={(body) => {
                        this.updateRecord("cycles",body)
                      }}
                      deleteWorkout={(body) => {
                        this.updateRecord("cycles",body)
                      }}
                    />
                  </Paper>
                }

                {showWorkouts &&
                  <Paper className={classes.paper}>
                    <WorkoutTemplates
                      workout_templates={workout_templates}
                      exercises={exercises}
                      cycle_templates={cycle_templates}
                      add={(body) => {this.addRecord("workout_templates",body)}}
                      update={(body) => {this.updateRecord("workout_templates",body)}}
                      destroy={(body) => {this.deleteRecord("workout_templates",body)}}
                      reorder={this.reorderWorkoutTemplates}

                    />
                  </Paper>
                }

                {showExercises &&
                  <Paper className={classes.paper}>
                    <Exercises
                      exercises={exercises}
                      references={references}
                      addExercise={(body) => {this.addRecord("exercises",body)}}
                      updateExercise={(body) => {this.updateRecord("exercises",body)}}
                      deleteExercise={(body) => {this.deleteRecord("exercises",body)}}
                    />
                  </Paper>
                }

                {showSettings &&
                  <Paper className={classes.paper}>
                    <Settings />
                  </Paper>
                }
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                {showCycles &&
                  <Paper className={classes.paper}>
                    <CycleTemplates
                      cycle_templates={cycle_templates}
                      addCycleTemplate={(body) => {this.addRecord("cycle_templates",body)}}
                      updateCycleTemplate={(body) => {this.updateRecord("cycle_templates",body)}}
                      deleteCycleTemplate={(body) => {this.deleteRecord("cycle_templates",body)}}
                    />
                  </Paper>
                }

                {showReferences &&
                  <Paper className={classes.paper}>
                    <References
                      references={references}
                      addReference={(body) => {this.addRecord("references",body)}}
                      updateReference={(body) => {this.updateRecord("references",body)}}
                      deleteReference={(body) => {this.deleteRecord("references",body)}}
                    />
                  </Paper>
                }
              </Grid>

            </Grid>

            <Box pt={4}>
              <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                  Matthew Steinwachs
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
              </Typography>
            </Box>
          </Container>
        </main>
      </div>
    );
  }

  componentDidMount() {
    this.getAll();
  }

  componentDidUpdate(){
    window.localStorage.setItem("panes", JSON.stringify({
      drawerOpen: this.state.drawerOpen,
      showExercises: this.state.showExercises,
      showReferences: this.state.showReferences,
      showWorkouts: this.state.showWorkouts,
      showCycles: this.state.showCycles,
      showPlanner: this.state.showPlanner,
      showSettings: this.state.showSettings
    }));
  }
}

export default withStyles(styles)(App);
