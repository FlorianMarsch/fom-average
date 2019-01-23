import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddGradeDialog extends React.Component {

    state = {
        name: "",
        credit: 0,
        grade: 0,
        exam: 0,
        assignment: 0,
        presentation: 0
    }

    calcGrade = (grade) => {

        let tests = 0;
        if (grade.exam > 0) {
            tests++;
        }
        if (grade.assignment > 0) {
            tests++;
        }
        if (grade.presentation > 0) {
            tests++;
        }
        return (grade.exam * 1 + grade.assignment * 1 + grade.presentation * 1) / tests;

    }

    render() {
        const { classes } = this.props;
        const { name, credit, exam, assignment, presentation } = this.state;

        let credits = [];
        for (let i = 1; i < 15; i++) {
            credits.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
        }
        let grades = [];
        grades.push(<MenuItem key={1} value={1}>1.0</MenuItem>);
        grades.push(<MenuItem key={1.3} value={1.3}>1.3</MenuItem>);
        grades.push(<MenuItem key={1.7} value={1.7}>1.7</MenuItem>);
        grades.push(<MenuItem key={2} value={2}>2.0</MenuItem>);
        grades.push(<MenuItem key={2.3} value={2.3}>2.3</MenuItem>);
        grades.push(<MenuItem key={2.7} value={2.7}>2.7</MenuItem>);
        grades.push(<MenuItem key={3} value={3}>3.0</MenuItem>);
        grades.push(<MenuItem key={3.3} value={3.3}>3.3</MenuItem>);
        grades.push(<MenuItem key={3.7} value={3.7}>3.7</MenuItem>);
        grades.push(<MenuItem key={4} value={4}>4.0</MenuItem>);



        return (
            <div>

                <Dialog
                    fullScreen
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={() => {
                                this.props.handleClose();
                                this.setState({
                                    name: "",
                                    credit: 0,
                                    grade: 0,
                                    exam: 0,
                                    assignment: 0,
                                    presentation: 0
                                });
                            }} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Kurs hinzufügen
                            </Typography>
                            <Button disabled={(exam !== 0 && assignment !== 0 && presentation !== 0) || name === "" || credit === 0} color="inherit" onClick={() => {
                                this.props.addGrade({ ...this.state, grade: this.calcGrade(this.state) });
                                this.setState({
                                    name: "",
                                    credit: 0,
                                    grade: 0,
                                    exam: 0,
                                    assignment: 0,
                                    presentation: 0
                                });
                            }}>
                                save
              </Button>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem >
                            <TextField
                                id="standard-name"
                                label="Module"
                                value={this.state.name}
                                onChange={(e) => {
                                    this.setState({
                                        ...this.state,
                                        name: e.target.value ? e.target.value : ""
                                    });
                                }}
                                margin="normal"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <InputLabel>Credits</InputLabel>
                            <Select
                                value={this.state.credit}
                                onChange={(e) => {
                                    this.setState({
                                        ...this.state,
                                        credit: e.target.value ? e.target.value : ""
                                    });
                                }}

                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                {credits}

                            </Select>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <InputLabel>Klausur</InputLabel>
                            <Select
                                value={this.state.exam}
                                onChange={(e) => {
                                    this.setState({
                                        ...this.state,
                                        exam: e.target.value ? e.target.value : 0
                                    });
                                }}

                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                {grades}

                            </Select>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <InputLabel>Hausarbeit</InputLabel>
                            <Select
                                value={this.state.assignment}
                                onChange={(e) => {
                                    this.setState({
                                        ...this.state,
                                        assignment: e.target.value ? e.target.value : 0
                                    });
                                }}

                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                {grades}

                            </Select>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <InputLabel>Präsi</InputLabel>
                            <Select
                                value={this.state.presentation}
                                onChange={(e) => {
                                    this.setState({
                                        ...this.state,
                                        presentation: e.target.value ? e.target.value : 0
                                    });
                                }}

                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                {grades}

                            </Select>
                        </ListItem>
                    </List>
                </Dialog>
            </div>
        );
    }
}

AddGradeDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddGradeDialog);