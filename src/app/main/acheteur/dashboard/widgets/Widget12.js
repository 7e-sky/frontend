import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, Typography, Paper, TableBody, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import ContentLoader from 'react-content-loader';
import moment from 'moment';

const TableRowContentLoader = (props) => {
    const random = Math.random() * (1 - 0.7) + 0.7;
    return (
        <ContentLoader
            height={40}
            width={1060}
            speed={2}
            primaryColor="#d9d9d9"
            secondaryColor="#ecebeb"
            {...props}
        >
            <rect x="0" y="15" rx="4" ry="4" width="6" height="6.4" />
            <rect x="34" y="13" rx="6" ry="6" width={200 * random} height="12" />
            <rect x="633" y="13" rx="6" ry="6" width={23 * random} height="12" />
            <rect x="653" y="13" rx="6" ry="6" width={78 * random} height="12" />
            <rect x="755" y="13" rx="6" ry="6" width={117 * random} height="12" />
            <rect x="938" y="13" rx="6" ry="6" width={83 * random} height="12" />
            <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3" />
        </ContentLoader>
    );
};

function Widget12(props) {
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));

    useEffect(() => {
        dispatch(Actions.getTeamPotentiels(currentRange));
    }, [dispatch, currentRange]);

    function handleChangeRange(ev) {
        setCurrentRange(ev.target.value);
    }

    return (
        <>
            {widgets.loadingTeamPotentiels === false ? (
                <Paper className="w-full rounded-8 shadow-none border-1">
                    <div className="flex items-center justify-between px-16 h-64 border-b-1">
                        <Typography className="text-24">Le suivi de l'année {currentRange}</Typography>
                        <div className="flex">
                            <Typography className="text-11 font-500 rounded-4 text-white bg-blue px-8 py-4">
                                {widgets.teamPotentiels.length + ' Acheteur(s) / Master(s)'}
                            </Typography>
                            <Select
                                native
                                className="ml-4 pl-4 text-11"
                                value={currentRange}
                                onChange={handleChangeRange}
                                inputProps={{
                                    name: 'currentRange',
                                }}
                                disableUnderline={true}
                            >
                                {Object.entries({
                                    '0': moment().format('Y'),
                                    '1': moment().subtract(1, 'year').format('Y'),
                                    '2': moment().subtract(2, 'year').format('Y'),
                                }).map(([key, n]) => (
                                    <option className="text-12 text-black" key={key} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <Table className="w-full min-w-full" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="whitespace-no-wrap">Acheteur / Master, NOM & Prénom</TableCell>
                                    <TableCell className="whitespace-no-wrap">BlackListe</TableCell>
                                    <TableCell className="whitespace-no-wrap">Budgets Acheteur / Master</TableCell>
                                    <TableCell className="whitespace-no-wrap">Nbr Demandes en attente</TableCell>
                                    <TableCell className="whitespace-no-wrap">Nbr Demandes en cours</TableCell>
                                    <TableCell className="whitespace-no-wrap">Nbr Demandes expirées</TableCell>
                                    <TableCell className="whitespace-no-wrap">Nbr Demandes Rejetées</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(widgets.teamPotentiels) &&
                                    widgets.teamPotentiels.map((teamData, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="whitespace-no-wrap">
                                               {/*  {teamData.team.nom} {teamData.team.prenom} */}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {/* {teamData.blacklistedTeams.length > 0 ? 'Yes' : 'No'} */}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {teamData.budgets}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {teamData.attentes}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {teamData.cours}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {teamData.expirees}
                                            </TableCell>
                                            <TableCell className="whitespace-no-wrap">
                                                {teamData.rejetees}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </Paper>
            ) : (
                <TableRowContentLoader />
            )}
        </>
    );
}

export default Widget12;
