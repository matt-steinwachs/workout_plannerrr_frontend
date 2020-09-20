import React, { Component, Fragment } from "react";
import AssessmentIcon from '@material-ui/icons/Assessment';
import {Button, Grid, Typography, Box, TextField, Slider} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';


import moment from 'moment';

import { ResponsiveLine } from '@nivo/line'

class Charts extends Component {
  constructor(props){
    super(props);

    this.prepData = this.prepData.bind(this);
    this.setSelectedExercises = this.setSelectedExercises.bind(this);

    this.state = {
      selectedExercises: [],
      weightRange: [0, 400],
      dateStart: null,
      dateEnd: null
    }
  }

  prepData(){
    const {cycles} = this.props;
    const {selectedExercises, dateStart, dateEnd} = this.state;
    let data = [];

    selectedExercises.forEach(e => {
      let d = {
        "id": e.name,
        "color": "hsl(293, 70%, 50%)",
        "data": []
      }
      cycles.forEach(c => {
        c.workouts.forEach(w => {
          w.blocks.forEach(b => {
            if (e.id == b.exercise_id){
              d["data"].push(
                {
                  "x": moment(w.start).format("YYYY-MM-DD"),
                  "y": Math.max(...b.rounds.map(r => r.weight))
                }
              )
            }
          })
        })
      })
      data.push(d);
    })
    return data;
  }

  setSelectedExercises(exercises){
    const {cycles} = this.props;
    const e_ids = exercises.map(e => e.id)
    let dates = []
    cycles.forEach(c => {
      c.workouts.forEach(w => {
        w.blocks.forEach(b => {
          if (e_ids.includes(b.exercise_id)){
            dates.push(moment(w.start))
          }
        });
      });
    });

    const dateStart = moment.min(dates).format("YYYY-MM-DD");
    const dateEnd = moment.max(dates).format("YYYY-MM-DD");

    this.setState({
      selectedExercises: exercises,
      dateStart: dateStart,
      dateEnd: dateEnd
    });
  }

  render(){
    const {cycles, exercises, references} = this.props;

    const {selectedExercises, dateEnd, dateStart, weightRange} = this.state;

    return (
      <Grid container >
        <Grid item xs={12}>
          <Typography style={{ display: 'flex', alignItems: 'center'}} component="h2" variant="h5" color="inherit" noWrap>
            <AssessmentIcon fontSize="large"/> Charts
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="selectedExercises"
            options={exercises}
            getOptionLabel={(option) => option.name}
            style={{ width: "100%", marginTop:"15px" }}
            onChange={(event, exercises) => this.setSelectedExercises(exercises)}
            renderInput={(params) => <TextField {...params} label="Exercises" variant="outlined" />}
          />
        </Grid>



        {selectedExercises.length > 0 &&
          (() => {
            let data = this.prepData()

            return (
              <Fragment>
                <Grid item xs={12} md={6} style={{padding:"20px"}}>
                  <Typography id="weight-range" gutterBottom>
                    Weight Range
                  </Typography>
                  <Slider
                    id="weight-range"
                    value={weightRange}
                    min={0}
                    step={1}
                    max={400}
                    onChange={(e,v) => {this.setState({weightRange:v})}}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                    marks={[{value:0, label:"0"}, {value:400, label:"400"}]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
                  <Typography id="date-start" gutterBottom>
                    Date Start
                  </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="YYYY-MM-DD"
                      margin="dense"
                      id="date-start"
                      onChange={(e, v) => {this.setState({dateStart:v})}}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      value={dateStart}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
                  <Typography id="date-end" gutterBottom>
                    Date End
                  </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="YYYY-MM-DD"
                      margin="dense"
                      id="date-end"
                      onChange={(e, v) => {this.setState({dateEnd:v})}}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      value={dateEnd}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} style={{height:"70vh"}}>
                  <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%d',
                        useUTC: false,
                        precision: 'day',
                        min: dateStart,
                        max: dateEnd

                    }}
                    xFormat="time:%Y-%m-%d"
                    yScale={{
                        type: 'linear',
                        stacked: false,
                        min:weightRange[0],
                        max:weightRange[1]
                    }}
                    axisLeft={{
                        legend: 'max weight lifted',
                        legendPosition: 'middle',
                        legendOffset: -48
                    }}
                    axisBottom={{
                        format: '%b %d',
                        legend: 'workout dates',
                        legendPosition: 'middle',
                        legendOffset: 36
                    }}
                    colors={{ scheme: 'dark2' }}
                    pointSize={5}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 80,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: 'circle',
                          symbolBorderColor: 'rgba(0, 0, 0, .5)',
                          effects: [
                              {
                                  on: 'hover',
                                  style: {
                                      itemBackground: 'rgba(0, 0, 0, .03)',
                                      itemOpacity: 1
                                  }
                              }
                          ]
                      }
                    ]}

                  />
                </Grid>
              </Fragment>
            )
          })()
        }
      </Grid>
    )
  }
}

export default Charts;
