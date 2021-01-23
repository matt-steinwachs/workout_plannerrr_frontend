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

    this.prepDataMax = this.prepDataMax.bind(this);
    this.prepDataTime = this.prepDataTime.bind(this);
    this.prepDataTonnage = this.prepDataTonnage.bind(this);
    this.prepMarkers = this.prepMarkers.bind(this);
    this.setSelectedExercises = this.setSelectedExercises.bind(this);

    this.state = {
      selectedExercises: [],
      weightRange: [0, 400],
      dateStartMax: null,
      dateEndMax: null,
      dateStartTime: moment().startOf("month").format("YYYY-MM-DD"),
      dateEndTime: moment().endOf("month").format("YYYY-MM-DD")
    }
  }

  prepDataMax(){
    const {cycles} = this.props;
    const {selectedExercises, dateStartMax, dateEndMax} = this.state;
    let data = [];

    selectedExercises.forEach(e => {
      let d = {
        "id": e.name,
        "data": []
      }
      cycles.forEach(c => {
        c.workouts.forEach(w => {
          w.blocks.forEach(b => {
            if (
              e.id == b.exercise_id &&
              moment(w.start).isSameOrAfter(moment(dateStartMax)) &&
              moment(w.start).isSameOrBefore(moment(dateEndMax).endOf('day'))
            ){
              let maxRound = null;
              b.rounds.forEach(r => {
                if (maxRound == null || maxRound.weight < r.weight){
                  maxRound = r;
                }
              });

              d["data"].push(
                {
                  "x": moment(w.start).format("YYYY-MM-DD"),
                  "y": maxRound.weight,
                  "reps": maxRound.reps,
                  "sets": maxRound.sets
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

  prepDataTonnage(){
    const {cycles} = this.props;
    const {selectedExercises, dateStartMax, dateEndMax} = this.state;
    let data = [];

    selectedExercises.forEach(e => {
      let d = {
        "id": e.name,
        "data": [],
        "yMin": 100000000,
        "yMax": 0
      }
      cycles.forEach(c => {
        c.workouts.forEach(w => {
          w.blocks.forEach(b => {
            if (
              e.id == b.exercise_id &&
              moment(w.start).isSameOrAfter(moment(dateStartMax)) &&
              moment(w.start).isSameOrBefore(moment(dateEndMax).endOf('day'))
            ){
              let tonnage = 0;
              let desc = [];
              b.rounds.forEach(r => {
                tonnage += r.weight * r.reps * r.sets;
                desc.push([r.weight,r.reps,r.sets].join("x"))
              });

              if (d["yMin"] > tonnage)
                d["yMin"] = tonnage;

              if (d["yMax"] < tonnage)
                d["yMax"] = tonnage;

              d["data"].push(
                {
                  "x": moment(w.start).format("YYYY-MM-DD"),
                  "y": tonnage,
                  "description": desc
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

  prepDataTime(){
    const {cycles} = this.props;
    const {dateStartTime, dateEndTime} = this.state;
    let data = {
      "id": "Workout Durations",
      "data": []
    };
    cycles.forEach(c => {
      c.workouts.forEach(w => {
          if (
            moment(w.start).isSameOrAfter(moment(dateStartTime)) &&
            moment(w.start).isSameOrBefore(moment(dateEndTime).endOf('day'))
          ){
            const duration = moment.duration(moment(w.end).diff(moment(w.start))).asMinutes();
            data["data"].push({
              "x": moment(w.start).format("YYYY-MM-DD"),
              "y": duration,
              "name": w.name
            });
          }
      })
    });
    return [data];
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

    const dateStartMax = moment.min(dates).format("YYYY-MM-DD");
    const dateEndMax = moment.max(dates).format("YYYY-MM-DD");

    this.setState({
      selectedExercises: exercises,
      dateStartMax: dateStartMax,
      dateEndMax: dateEndMax
    });
  }

  prepMarkers(start, end){
    const {cycles} = this.props;
    const {dateStartMax, dateEndMax} = this.state;

    let m = [];
    cycles.forEach(c => {
      if (c.start){
        let cstart = moment(c.start);
        if (
          cstart.isSameOrAfter(moment(start)) &&
          cstart.isSameOrBefore(moment(end).endOf('day'))
        ){
          m.push(
            {
              axis: 'x',
              value: cstart,
              lineStyle: { stroke: 'green', strokeWidth: 1 },
              legend: "start of "+c.name,
              legendOrientation: 'vertical',
              textStyle:{fontWeight: "bold"}
            }
          )
        }

        let cend = moment(c.end);
        if (
          cend.isSameOrAfter(moment(start)) &&
          cend.isSameOrBefore(moment(end).endOf('day'))
        ){
          m.push(
            {
              axis: 'x',
              value: cend,
              lineStyle: { stroke: 'red', strokeWidth: 1 },
              legend: "end of "+c.name,
              legendOrientation: 'vertical',
              legendOffsetX: -12,
              textStyle:{fontWeight: "bold"}
            }
          )
        }


      }
    });

    return m;
  }

  render(){
    const {cycles, exercises, references} = this.props;
    const {selectedExercises, dateEndMax, dateStartMax, dateEndTime, dateStartTime, weightRange} = this.state;

    let dataTime = this.prepDataTime();

    console.log(dataTime);

    return (
      <Grid container >
        <Grid item xs={12}>
          <Typography style={{ display: 'flex', alignItems: 'center'}} component="h2" variant="h5" color="inherit" noWrap>
            <AssessmentIcon fontSize="large"/> Charts
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}} component="h3" variant="h5" color="inherit" noWrap>
            Exercise Maxes and Tonnage
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
            let dataMax = this.prepDataMax();
            let dataTonnage = this.prepDataTonnage();

            let markers = this.prepMarkers(dateStartMax, dateEndMax);

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
                    step={5}
                    max={400}
                    onChange={(e,v) => {this.setState({weightRange:v})}}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                    marks={[{value:0, label:"0"}, {value:400, label:"400"}]}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
                  <Typography id="date-start-max" gutterBottom>
                    Date Start
                  </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="YYYY-MM-DD"
                      margin="dense"
                      id="date-start-max"
                      onChange={(e, v) => {this.setState({dateStartMax:v})}}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      value={dateStartMax}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
                  <Typography id="date-end-max" gutterBottom>
                    Date End
                  </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="YYYY-MM-DD"
                      margin="dense"
                      id="date-end-max"
                      onChange={(e, v) => {this.setState({dateEndMax:v})}}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      value={dateEndMax}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} style={{height:"70vh"}}>
                  <Typography style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}} component="h3" variant="h5" color="inherit" noWrap>
                    Maxes
                  </Typography>
                  <ResponsiveLine
                    data={this.prepDataMax()}
                    margin={{ top: 50, right: 150, bottom: 50, left: 90 }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%d',
                        useUTC: false,
                        precision: 'day',
                        min: dateStartMax,
                        max: dateEndMax

                    }}
                    xFormat="time:%Y-%m-%d"
                    yScale={{
                        type: 'linear',
                        stacked: false,
                        min:weightRange[0],
                        max:weightRange[1]
                    }}
                    markers={markers}
                    tooltip={({point}) => {
                        return (
                          <div
                            style={{
                              background: 'white',
                              padding: '5px',
                              border: '1px solid #ccc',
                            }}
                          >
                           <p style={{margin:"0px"}}><strong>{point.serieId}</strong></p>
                           <p style={{margin:"0px"}}>{point.data.xFormatted}</p>
                           <p style={{margin:"0px"}}>{point.data.y} x {point.data.reps} x {point.data.sets}</p>
                          </div>
                        )
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
                          anchor: 'top-right',
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

                <Grid item xs={12} style={{height:"75vh"}}>
                  <Box mt={5}>
                    <Typography style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}} component="h3" variant="h5" color="inherit" noWrap>
                      Tonnage
                    </Typography>
                  </Box>
                  <ResponsiveLine
                    data={dataTonnage}
                    margin={{ top: 50, right: 150, bottom: 50, left: 90 }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%d',
                        useUTC: false,
                        precision: 'day',
                        min: dateStartMax,
                        max: dateEndMax

                    }}
                    xFormat="time:%Y-%m-%d"
                    yScale={{
                        type: 'linear',
                        stacked: false,
                        min:Math.floor(Math.min(...dataTonnage.map(d => d.yMin))/100)*100-100,
                        max:Math.floor(Math.max(...dataTonnage.map(d => d.yMax))/100)*100+200,
                    }}
                    markers={markers}
                    tooltip={({point}) => {
                        return (
                          <div
                            style={{
                              background: 'white',
                              padding: '5px',
                              border: '1px solid #ccc',
                            }}
                          >
                           <p style={{margin:"0px"}}><strong>{point.serieId}</strong></p>
                           <p style={{margin:"0px"}}>{point.data.xFormatted}</p>
                           <p style={{margin:"0px"}}>{point.data.y}</p>
                           <hr/>
                           {point.data.description.map(d => <p key={d} style={{margin:"0px"}}>{d}</p>)}

                          </div>
                        )
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
                          anchor: 'top-right',
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


        <Grid item xs={12}>
          <Box mt={10}>
            <Typography style={{ display: 'flex', alignItems: 'center', justifyContent: "center"}} component="h3" variant="h5" color="inherit" noWrap>
              Workout Durations
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
          <Typography id="date-start-time" gutterBottom>
            Date Start
          </Typography>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="YYYY-MM-DD"
              margin="dense"
              id="date-start"
              onChange={(e, v) => {this.setState({dateStartTime:v})}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              value={dateStartTime}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
          <Typography id="date-end-time" gutterBottom>
            Date End
          </Typography>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="YYYY-MM-DD"
              margin="dense"
              id="date-end-time"
              onChange={(e, v) => {this.setState({dateEndTime:v})}}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              value={dateEndTime}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12} sm={6} md={3} style={{padding:"20px"}}>
          <Typography id="date-end-time" gutterBottom>
            Total Time: {
              (Math.floor(
                this.prepDataTime()[0].data.reduce(( acc, cur ) => acc + cur.y, 0 )
              )/60).toFixed(2)
            } hours
          </Typography>
        </Grid>

        <Grid item xs={12} style={{height:"70vh"}}>
          <ResponsiveLine
            data={dataTime}
            margin={{ top: 50, right: 150, bottom: 50, left: 90 }}
            // lineWidth={0}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
                min: dateStartTime,
                max: dateEndTime
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
                stacked: false,
                min:Math.min(...dataTime[0].data.map(d => d.y))-20,
                max:Math.max(...dataTime[0].data.map(d => d.y))+20,
            }}
            markers={this.prepMarkers(dateStartTime, dateEndTime)}
            tooltip={({point}) => {
                return (
                  <div
                    style={{
                      background: 'white',
                      padding: '5px',
                      border: '1px solid #ccc',
                    }}
                  >
                   <p style={{margin:"0px"}}><strong>{point.serieId}</strong></p>
                   <p style={{margin:"0px"}}>{point.data.xFormatted}</p>
                   <p style={{margin:"0px"}}>{Math.floor(point.data.y)} minutes</p>
                   <p style={{margin:"0px"}}>{point.data.name}</p>
                  </div>
                )
            }}
            axisLeft={{
                legend: 'workout duration (minutes)',
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
                  anchor: 'top-right',
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
      </Grid>
    )
  }
}

export default Charts;
