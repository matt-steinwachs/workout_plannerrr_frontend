import React, {Fragment} from 'react';
import {
  Button, TextareaAutosize, Grid, Box
} from '@material-ui/core';

const API = process.env.REACT_APP_API || 'http://localhost:3001/api/v1';

class Settings extends React.Component {
  constructor(props){
    super(props);

    this.export = this.export.bind(this);
    this.import = this.import.bind(this);
    this.updateText = this.updateText.bind(this);

    this.state = {
      showTextArea: false,
      text: ""
    };
  }


  async export() {
    try {
      const response = await fetch(
        `${API}/export`,
        {
          method: "GET",
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
          },
        }
      );
      let resp = await response.json();
      this.setState({showTextArea: true, text: JSON.stringify(resp, null, 2)});
    } catch (error) {
      this.setState({ error });
    }
  }

  async import() {
    try {
      JSON.parse(this.state.text);
    } catch (e) {
      alert("Invalid JSON");
      return false;
    }

    try {
      const response = await fetch(`${API}/import`, {
        method: "POST",
        body: JSON.stringify({data: this.state.text}),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });
      let resp = await response.json();
      alert(resp.status);
      document.location.reload();

    } catch (error) {
      this.setState({ error });
    }
  }

  updateText(event){

    this.setState({text: event.target.value});
  }

  render() {
    return (
      <Grid container justify="space-between">
        <Grid item sm={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.export}
          >
            Export
          </Button>
        </Grid>

        {this.state.showTextArea &&
          <Fragment>
            <Grid item sm={4}>
              <center>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (window.confirm("Are you sure?")){
                      this.import();
                    }
                  }}
                >
                  Import
                </Button>
              </center>
            </Grid>
            <Grid item sm={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.setState({showTextArea: false})}
                style={{float:"right"}}
              >
                Hide App Data
              </Button>
            </Grid>
            <Grid item sm={12}>
              <Box mt={2}>
                <TextareaAutosize
                  style={{width:"100%", maxHeight:"70vh", overflow:"scroll"}}
                  id="outlined-multiline-flexible"
                  label="App Data"
                  value={this.state.text}
                  onChange={this.updateText}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Fragment>
        }
      </Grid>
    )
  }
}

export default Settings;
