import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Typography, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import ReactTable from "react-table";
import _ from '@lodash';
import { makeStyles } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';

const useStyles = makeStyles(theme => ({

    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

}));

function ChildTable(props) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const childs = useSelector(({ childsFrsApp }) => childsFrsApp.childs.data);
    const loading = useSelector(({ childsFrsApp }) => childsFrsApp.childs.loading);
    const loadingEdit = useSelector(({ childsFrsApp }) => childsFrsApp.childs.loadingEdit);
    const user = useSelector(({ auth }) => auth.user);
    const searchText = useSelector(({ childsFrsApp }) => childsFrsApp.childs.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (childs) {
            setFilteredData(getFilteredArray(childs, searchText));
        }
    }, [childs, searchText]);



    if (!filteredData) {
        return null;
    }

    if (filteredData.length === 0 && loading === false) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    Aucune d'essai de s'inscrire trouvée
                </Typography>
            </div>
        );
    }


    return (
        <div className="w-full flex flex-col">


            <FuseAnimate animation="transition.slideUpIn" delay={300}>

                <ReactTable

                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64 ",

                        }
                    }}
                    getTheadProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64",

                        }
                    }}

                    data={filteredData}
                    columns={[

                        {
                            Header: "Nom",
                            accessor: "firstName",
                            filterable: true,
                            className: "justify-center ",
                            Cell: row => row.original.firstName ? row.original.firstName : '',
                        },
                        {
                            Header: "Prénom",
                            accessor: "lastName",
                            className: "justify-center ",
                            filterable: true,
                            Cell: row => row.original.lastName ? row.original.lastName : '',
                        },
                        {
                            Header: "Téléphone",
                            accessor: "phone",
                            className: "justify-center ",
                            filterable: true,
                            Cell: row => row.original.phone ? row.original.phone : '',
                        },
                        {
                            Header: "Email",
                            accessor: "email",
                            className: "justify-center ",
                            filterable: true,
                            Cell: row => row.original.email ? row.original.email : '',

                        },
                        {
                            Header: "Date de création",
                            accessor: "created",
                            filterable: false,
                            className: "justify-center ",
                            Cell: row => row.original.created ? moment(row.original.created).format('DD/MM/YYYY HH:mm') : 'N/A'
                        },
                        {
                            Header: "",
                            className: "justify-center ",
                            Cell: row => (
                                <div className="flex items-center">

                                    <Tooltip title="Ajouter comme un acheteur / Master" >
                                        <Button size="small" variant="contained" color="primary"
                                            disabled={loadingEdit}
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                dispatch(Actions.openDialog({
                                                    children: (
                                                        <React.Fragment>
                                                            <DialogTitle id="alert-dialog-title">Nouveau Acheteur / Master</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="alert-dialog-description">
                                                                    Vous êtes en train d'ajouter une nouveau Acheteur / Master,
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={() => dispatch(Actions.closeDialog())} variant="outlined" color="primary">
                                                                    Annuler
                                                                </Button>
                                                                <Button
                                                                    onClick={(ev) => {
                                                                        dispatch(Actions.updateType(row.original.id, 1, user.id));
                                                                        dispatch(Actions.closeDialog())
                                                                    }}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    autoFocus>
                                                                    Ajouter
                                                            </Button>
                                                            </DialogActions>
                                                        </React.Fragment>
                                                    )
                                                }))
                                            }}
                                        >
                                            {loadingEdit && <CircularProgress size={24} className={classes.buttonProgress} />}
                                            nouveau Acheteur / Master
                                        </Button>
                                    </Tooltip>


                                </div>
                            )
                        },
                        /* {
                            Header: "",
                            className: "justify-center ",
                            Cell: row => (
                                <div className="flex items-center">



                                    <Tooltip title="Ajouter comme un nouveau acheteur" >
                                        <Button size="small" variant="contained"
                                            color="secondary"
                                            disabled={loadingEdit}
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                dispatch(Actions.openDialog({
                                                    children: (
                                                        <React.Fragment>
                                                            <DialogTitle id="alert-dialog-title">Duplication</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="alert-dialog-description">
                                                                    Vous êtes en train d'ajouter un nouveau collègue qui portera le même nom de votre société avec
                                                                    les mêmes fonctionnalités que les vôtres.
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={() => dispatch(Actions.closeDialog())} variant="outlined" color="primary">
                                                                    Annuler
                                                            </Button>
                                                                <Button
                                                                    onClick={(ev) => {
                                                                        dispatch(Actions.updateType(row.original.id, 2, user.id));
                                                                        dispatch(Actions.closeDialog())
                                                                    }}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    autoFocus>
                                                                    Ajouter
                                                        </Button>
                                                            </DialogActions>
                                                        </React.Fragment>
                                                    )
                                                }))
                                            }}
                                        >
                                            {loadingEdit && <CircularProgress size={24} className={classes.buttonProgress} />}
                                            Autorisation collègue
                                        </Button>
                                    </Tooltip>


                                </div>
                            )
                        },
 */
                        {
                            Header: "",
                            className: "justify-center ",
                            Cell: row => (
                                <div className="flex items-center">

                                    <Tooltip title="Supprimer" >
                                        <IconButton className="text-red text-20"
                                            disabled={loadingEdit}
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                dispatch(Actions.openDialog({
                                                    children: (
                                                        <React.Fragment>
                                                            <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="alert-dialog-description">
                                                                    Voulez vous vraiment supprimer cet enregistrement ?
                                                            </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                                    Non
                                                            </Button>
                                                                <Button
                                                                    onClick={(ev) => {
                                                                        dispatch(Actions.removeTentative(row.original, user))
                                                                        dispatch(Actions.closeDialog())
                                                                    }}
                                                                    color="primary"
                                                                    autoFocus>
                                                                    Oui
                                                            </Button>
                                                            </DialogActions>
                                                        </React.Fragment>
                                                    )
                                                }))
                                            }}
                                        >
                                            <Icon>
                                                {loadingEdit && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                delete
                                            </Icon>
                                        </IconButton>
                                    </Tooltip>

                                </div>
                            )
                        }
                    ]}
                    defaultPageSize={10}
                    noDataText="Aucune d'essai de s'inscrire trouvée"
                    loading={loading}
                    loadingText='Chargement...'
                    ofText='sur'
                />
            </FuseAnimate>




        </div>
    );
}

export default withRouter(ChildTable);
