import React, { Component } from 'react';
import {
  Typography,
  Button,
  List
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import PublishIcon from '@material-ui/icons/Publish';

import Reference from './Reference';
import ReferenceForm from './ReferenceForm';

class References extends Component {
  constructor(props){
    super(props);

    this.state = {
      adding: false
    };
  }

  render(){
    const {references, addReference, updateReference, deleteReference} = this.props;

    return(
      <div>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          style={{ display: 'flex', alignItems: 'center'}}
        >
          <PublishIcon fontSize="large"/>
          References
        </Typography>

        <List>
          {references.map((m) =>
            <Reference
              reference={m}
              key={m.id}
              updateReference={updateReference}
              onDelete={() => {deleteReference(m)}}
            />
          )}
        </List>
        {this.state.adding ?
          <ReferenceForm
            onSubmit={async (body) => {
              await addReference(body);
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

export default References;
