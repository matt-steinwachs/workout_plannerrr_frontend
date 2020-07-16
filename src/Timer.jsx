import React, {useState, useMemo, Fragment, Component} from 'react';
import { Box, Chip} from '@material-ui/core';
import { Timer as TimerIcon } from '@material-ui/icons';
import moment from 'moment';

class Timer extends Component {
  constructor(props){
    super(props);

    this.state = {
      now: moment()
    }
  }


  render(){
    const {start} = this.props;
    const {now} = this.state;

    return (
      <Box display="inline-block" ml={2} mt={1}>
        <Chip icon={<TimerIcon />} label={moment.utc(now.diff(moment(start))).format("HH:mm:ss")} />
      </Box>
    )
  }

  componentDidMount(){
    setInterval(() => {
      this.setState({now:moment()});
    }, 1000);
  }
}

export default Timer
