import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import AddGradeDialog from './AddGradeDialog';
import GraphView from './GraphView';

const styles = theme => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,

  },
});

const defaultState = [];

const getPersistedState = () => {
  const persisted = localStorage.getItem("fom-average.grades");
  if (persisted) {
    return JSON.parse(persisted);
  } else {
    return defaultState;
  }
}

const setPersistedState = (grades) => {
  localStorage.setItem("fom-average.grades", JSON.stringify(grades));
}

class App extends Component {

  state = {
    dialogOpen: false,
    grades: getPersistedState(),
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };
  handleAddGrade = (grade) => {
    this.state.grades.push({
      ...grade,
      archived: new Date(),
      averageUntil: this.getAverage(this.state.grades)
    });
    setPersistedState(this.state.grades);

    this.setState({ dialogOpen: false, grades: this.state.grades });
  };

  getAverage = (grades) => {
    console.log(grades);
    return grades.map(element => { return element.grade * element.credit }).reduce((element, sum) => { return element + sum }, 0) / this.getCredits(grades);
  }
  getCredits = (grades) => {
    return grades.map(element => { return element.credit }).reduce((element, sum) => { return element + sum }, 0);
  }


  render() {
    const { classes } = this.props;
    const { dialogOpen, grades } = this.state;

    const sorted = grades.sort((a, b) => {
      return new Date(b.archived).getTime() - new Date(a.archived).getTime()
    });

    const neededCredits = 137 - this.getCredits(grades);
    const bestGrade = { grade: 1, credit: neededCredits };
    const bestAverage = this.getAverage([...grades, bestGrade]);

    const worstGrade = { grade: 4, credit: neededCredits };
    const worstAverage = this.getAverage([...grades, worstGrade])

    const currentAverage = this.getAverage(this.state.grades);

    return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" color="inherit" >
              FOM Durchnschnittsnote : {currentAverage.toFixed(2)}
            </Typography>
          </Toolbar>
        </AppBar>
        <AddGradeDialog open={dialogOpen} handleClose={this.handleDialogClose} addGrade={this.handleAddGrade} />
        <GraphView grades={grades} average={currentAverage} min={bestAverage} max={worstAverage} />
        <List >
          {sorted.map((grade, index) => {
            return (
              <React.Fragment>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container spacing={16}>
                      <Grid item xs={9}>
                        <ListItemText
                          primary={grade.name}
                          secondary={`${grade.credit} Credits`}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <ListItemText
                          primary={grade.grade && grade.grade.toFixed(1)}
                          secondary={'Note'}
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Grid container spacing={16}>
                      <Grid item xs={3}>
                        {grade.exam > 0 && <ListItemText
                          primary={grade.exam}
                          secondary={`Klausur`}
                        />}
                      </Grid>
                      <Grid item xs={3}>
                        {grade.presentation > 0 && <ListItemText
                          primary={grade.presentation}
                          secondary={`Präsi`}
                        />}
                      </Grid>
                      <Grid item xs={3}>
                        {grade.assignment > 0 && <ListItemText
                          primary={grade.assignment}
                          secondary={`Hausarbeit`}
                        />}
                      </Grid>
                      <Grid item xs={3}>
                        {grade.averageUntil && <ListItemText
                          primary={(this.getAverage(sorted.slice(index, sorted.length)) - grade.averageUntil).toFixed(2)}
                          secondary={`Auswirkung`}
                        />}
                      </Grid>

                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>


                {grade.averageUntil && <React.Fragment>
                  <Divider />
                  <Grid container spacing={16}>
                    <Grid item xs={9}>

                    </Grid>
                    <Grid item xs={3}>
                      <ListItemText
                        secondary={`Ø:${grade.averageUntil.toFixed(2)}`}
                      />
                    </Grid>
                  </Grid>
                  <Divider />
                </React.Fragment>}
              </React.Fragment>
            );
          })}
        </List>


        <Zoom
          in={true}
          unmountOnExit
        >
          <Fab className={classes.speedDial} onClick={this.handleDialogOpen}>
            <AddIcon></AddIcon>
          </Fab>
        </Zoom>
      </div>
    );
  }
}

export default withStyles(styles)(App);
