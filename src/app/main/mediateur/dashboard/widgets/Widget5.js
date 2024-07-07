import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/styles';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import { FuseAnimate } from '@fuse';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
    }
}));

function Widget5(props) {


    const mainThemeDark = useSelector(({ fuse }) => fuse.settings.mainThemeDark);
    const dispatch = useDispatch();
    const [currentRange, setCurrentRange] = useState({
        startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
        endDate: moment().endOf('isoWeek').format('YYYY-MM-DD')
    });

    const classes = useStyles(props);
    const theme = useTheme();

    const [range, setRange] = useState('0');
    const [widget, setWidget] = useState(null);
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);

    //startDate:moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'),
    //endDate:moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
    useEffect(() => {
        dispatch(Actions.getCharts(currentRange));
    }, [dispatch, currentRange]);

    useEffect(() => {
        setWidget(_.merge({}, widgets.charts))
    }, [widgets.charts]);

    function handleChangeRange(range) {
        setRange(range);
        if (range === '1') {
            setCurrentRange({
                startDate: moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'),
                endDate: moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
            })
        } else if (range === '2') {
            setCurrentRange({
                startDate: moment().subtract(2, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'),
                endDate: moment().subtract(2, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
            })
        } else {
            setCurrentRange({
                startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
                endDate: moment().endOf('isoWeek').format('YYYY-MM-DD')
            })
        }
    }

    return (

        <ThemeProvider theme={mainThemeDark}>
            <div className={classes.root}>
                <div className="container relative p-16 sm:p-24 flex flex-row justify-between items-center">

                    <FuseAnimate delay={100}>
                        <div className="flex-col">
                            <Typography className="h2" color="textPrimary">{widget && widget.title}</Typography>
                        </div>
                    </FuseAnimate>

                    <div className="flex flex-row items-center">
                        {Object.entries({
                            '0': 'Cette semaine',
                            '1': 'La semaine dernière',
                            '2': 'Il y a 2 semaines'
                        }).map(([key, n]) => {
                            return (
                                <Button
                                    key={key}
                                    className="normal-case shadow-none px-16"
                                    onClick={() => handleChangeRange(key)}
                                    color={range === key ? "secondary" : "default"}
                                    variant={range === key ? "contained" : "text"}
                                >
                                    {n}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                <div className="container relative h-200 sm:h-256 pb-16">
                    <Line
                        data={{

                            labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
                            datasets: widget && widget.mainChart
                                ?
                                widget.mainChart.datasets.map(obj => ({
                                    ...obj,
                                    borderColor: theme.palette.secondary.main,
                                    backgroundColor: theme.palette.secondary.main,
                                    pointBackgroundColor: theme.palette.secondary.dark,
                                    pointHoverBackgroundColor: theme.palette.secondary.main,
                                    pointBorderColor: theme.palette.secondary.contrastText,
                                    pointHoverBorderColor: theme.palette.secondary.contrastText
                                }))
                                :
                                []

                        }}
                        options={
                            {
                                spanGaps: false,
                                legend: {
                                    display: false
                                },
                                maintainAspectRatio: false,
                                tooltips: {
                                    position: 'nearest',
                                    mode: 'index',
                                    intersect: false
                                },
                                layout: {
                                    padding: {
                                        top: 32,
                                        left: 32,
                                        right: 32
                                    }
                                },
                                elements: {
                                    point: {
                                        radius: 4,
                                        borderWidth: 2,
                                        hoverRadius: 4,
                                        hoverBorderWidth: 2
                                    },
                                    line: {
                                        tension: 0
                                    }
                                },
                                scales: {
                                    xAxes: [
                                        {
                                            gridLines: {
                                                display: false,
                                                drawBorder: false,
                                                tickMarkLength: 18
                                            },
                                            ticks: {
                                                fontColor: '#ffffff'
                                            }
                                        }
                                    ],
                                    yAxes: [
                                        {
                                            display: false,
                                            gridLines: {
                                                tickMarkLength: 16
                                            },
                                            ticks: {
                                                min: 0,
                                                max: 25,
                                                stepSize: 0.5
                                            }
                                        }
                                    ]
                                },
                                plugins: {
                                    filler: {
                                        propagate: false
                                    },
                                    xLabelsOnTop: {
                                        active: true,
                                        render: 'k'

                                    }
                                },

                            }
                        }
                    />
                </div>
            </div>
        </ThemeProvider>


    );
}

export default withReducer('dashboardApp', reducer)(Widget5);
