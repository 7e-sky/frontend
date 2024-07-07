import React, { useState, useEffect } from 'react';
import { Typography, Select, Paper } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'
import ContentLoader from 'react-content-loader'

function Widget6(props) {

    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const [currentRange, setCurrentRange] = useState(
        moment().format('Y')
    );

    useEffect(() => {
        dispatch(Actions.getBudgets(currentRange));
    }, [dispatch, currentRange]);

    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }


    return (

        <>
            {widgets.loadingBudgets === false

                ?
                <Paper className="w-full rounded-8 shadow-none border-1">
                    <div className="flex items-center justify-between px-16 h-64 border-b-1">
                        <Typography className="text-16">Budget de l'année {currentRange} jusqu'à maintenant</Typography>

                        <Select
                            native
                            value={currentRange}
                            onChange={handleChangeRange}
                            inputProps={{
                                name: 'currentRange'
                            }}
                            disableUnderline={true}
                        >
                            {Object.entries({
                                '0': moment().format('Y'),
                                '1': moment().subtract(1, 'year').format('Y'),
                                '2': moment().subtract(2, 'year').format('Y'),
                            }).map(([key, n]) => {
                                return (
                                    <option key={key} value={n}>{n}</option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className="text-center px-24 py-32">

                        <Typography className="text-24 leading-tight" color="textSecondary">
                            {currentRange}
                        </Typography>
                        <Typography className="text-72 leading-tight text-green" >
                            {widgets.budgets && parseFloat(widgets.budgets).toLocaleString(
                                undefined, // leave undefined to use the browser's locale,
                                // or use a string like 'en-US' to override it.
                                { minimumFractionDigits: 2 }
                            )}
                            &ensp;Dhs
                        </Typography>
                        <Typography className="text-24 leading-tight" color="textSecondary">
                            HT
                            </Typography>
                    </div>

                </Paper>
                :
                <ContentLoader
                    height={280}
                    width={500}
                    speed={3}
                    primaryColor="#f3f3f3"
                    secondaryColor="#ecebeb"
                >
                    <rect x="3" y="3" rx="10" ry="10" width="300" height="180" />
                    <rect x="6" y="190" rx="0" ry="0" width="292" height="20" />
                    <rect x="4" y="215" rx="0" ry="0" width="239" height="20" />
                    <rect x="4" y="242" rx="0" ry="0" width="274" height="20" />
                </ContentLoader>}

        </>
    );
}

export default React.memo(Widget6);
