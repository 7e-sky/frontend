import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Avatar,
} from "@material-ui/core";
import { FuseUtils, FuseAnimate, URL_SITE } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table";
import * as Actions from "./store/actions";
import moment from "moment";

function TeamsList(props) {
  const dispatch = useDispatch();
  const teams = useSelector(({ teamsApp }) => teamsApp.teams.entities);
  const user = useSelector(({ auth }) => auth.user);
  const searchText = useSelector(({ teamsApp }) => teamsApp.teams.searchText);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    function getFilteredArray(entities, searchText) {
      const arr = Object.keys(entities).map((id) => entities[id]);
      if (searchText.length === 0) {
        return arr;
      }
      return FuseUtils.filterArrayByString(arr, searchText);
    }

    if (teams) {
      setFilteredData(getFilteredArray(teams, searchText));
    }
  }, [teams, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          Il n'y a pas d'Acheteur / Master!
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <ReactTable
        className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
        data={filteredData}
        columns={[
          {
            Header: "",
            Cell: (row) =>
              row.original.avatar ? (
                <Avatar
                  className="mr-8"
                  alt={row.original.firstName}
                  src={URL_SITE + row.original.avatar.url}
                />
              ) : (
                <Avatar
                  className="mr-8"
                  alt={row.original.firstName}
                  src="assets/images/avatars/images.png"
                />
              ),
            className: "justify-center",
            width: 64,
            sortable: false,
          },
          {
            Header: "Société",
            accessor: "user.societe",
            filterable: true,
            Cell: (row) => (row.original.user ? row.original.user.societe : ""),
          },
          {
            Header: "Nom & Prénom",
            accessor: "user",
            filterable: true,
            Cell: (row) =>
              row.original.acheteur
                ? `${row.original.acheteur.first_name} ${row.original.acheteur.last_name}`
                : `${row.original.user.first_name} ${row.original.user.last_name}`,
          },
          {
            Header: "Ville",
            accessor: "user.ville",
            filterable: true,
            Cell: (row) => (row.original.user ? row.original.user.ville : ""),
          },
          {
            Header: "Email",
            accessor: "email",
            filterable: true,
            Cell: (row) => (row.original.email ? row.original.email : ""),
          },
          {
            Header: "Téléphone",
            accessor: "phone",
            filterable: true,
            Cell: (row) => (row.original.phone ? row.original.phone : ""),
          },
          {
            Header: "Date de création",
            Cell: (row) =>
              moment(row.original.created).format("DD/MM/YYYY HH:mm"),
          },
          {
            Header: "",
            width: 128,
            Cell: (row) => (
              <div className="flex items-center">
                <Tooltip title="Editer">
                  <IconButton
                    className="text-orange text-20"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(Actions.openEditTeamsDialog(row.original));
                    }}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <IconButton
                    className="text-red text-20"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      dispatch(
                        Actions.openDialog({
                          children: (
                            <>
                              <DialogTitle id="alert-dialog-title">
                                Suppression
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  Voulez vous vraiment supprimer cet
                                  enregistrement ?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() =>
                                    dispatch(Actions.closeDialog())
                                  }
                                  color="primary"
                                >
                                  Non
                                </Button>
                                <Button
                                  onClick={(ev) => {
                                    dispatch(
                                      Actions.removeTeam(
                                        row.original,
                                        user.id
                                      )
                                    );
                                    dispatch(Actions.closeDialog());
                                  }}
                                  color="primary"
                                  autoFocus
                                >
                                  Oui
                                </Button>
                              </DialogActions>
                            </>
                          ),
                        })
                      );
                    }}
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
        defaultPageSize={10}
        noDataText="No teams found"
      />
    </FuseAnimate>
  );
}

export default TeamsList;
