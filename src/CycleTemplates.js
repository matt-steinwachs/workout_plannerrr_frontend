import React, { Component } from 'react';
import {
  Typography,
  Button,
  List
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import LoopIcon from '@material-ui/icons/Loop';

import CycleTemplate from './CycleTemplate';
import CycleTemplateForm from './CycleTemplateForm';

class CycleTemplates extends Component {
  constructor(props){
    super(props);

    this.state = {
      adding: false
    };
  }

  render(){
    const {cycle_templates, addCycleTemplate, updateCycleTemplate, deleteCycleTemplate} = this.props;

    return(
      <div>
        <Typography style={{display: "flex", alignItems: "center"}} component="h2" variant="h5" color="inherit" noWrap>
          <LoopIcon fontSize="large" />CycleTemplates
        </Typography>
        <List>
          {cycle_templates.map((m) =>
            <CycleTemplate
              cycle_template={m}
              key={m.id}
              updateCycleTemplate={updateCycleTemplate}
              onDelete={() => {if (window.confirm("Are you sure?")) deleteCycleTemplate(m)}}
            />
          )}
        </List>
        {this.state.adding ?
          <CycleTemplateForm
            onSubmit={async (body) => {
              await addCycleTemplate(body);
              this.setState({adding:false});
            }}
            onClose={() => {this.setState({adding:false})}}
          />
          :
          <Button
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            onClick={() => {this.setState({adding:true})}}
          >
            <AddIcon />
          </Button>
        }
      </div>
    )
  }
}

export default CycleTemplates;
