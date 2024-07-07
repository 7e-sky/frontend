import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  DialogTitle,
  DialogContentText,
  InputAdornment,
  Avatar,
  CircularProgress,
  Switch,
  FormControlLabel
} from "@material-ui/core";
import { useForm } from "@fuse/hooks";
import * as Actions from "./store/actions";
import { useDispatch, useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import Formsy from "formsy-react";
import _ from "@lodash";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const defaultFormState = {
/*   societe: "",
  firstName: "",
  lastName: "",
  adresse1: "",
  adresse2: "",
  codepostal: "",
  phone: "",
  email: "",
  pays: null,
  password: "",
  confirmpassword: "" */
  //isActif: 1
};

function TeamsDialog(props) {
  const dispatch = useDispatch();
  const teamsDialog = useSelector(({ teamsApp }) => teamsApp.teams.teamsDialog);
  const imageReqInProgress = useSelector(
    ({ teamsApp }) => teamsApp.teams.imageReqInProgress
  );
  const avatar = useSelector(({ teamsApp }) => teamsApp.teams.avatar);
  const user = useSelector(({ auth }) => auth.user);

  const { form, handleChange, setForm } = useForm(defaultFormState);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const initDialog = useCallback(() => {
    if (teamsDialog.type === "edit" && teamsDialog.data) {
      setForm({ ...teamsDialog.data });
    }

    if (teamsDialog.type === "new") {
      setForm({
        ...teamsDialog.data,
        ...defaultFormState,
      });
    }
  }, [teamsDialog.data, teamsDialog.type, setForm]);

  useEffect(() => {
    if (teamsDialog.props.open) {
      initDialog();
    }
  }, [teamsDialog.props.open, initDialog]);

  useEffect(() => {
    if (avatar) {
      setForm(_.set({ ...form }, "avatar", avatar));
    } else {
      setForm(_.set({ ...form }, "avatar", null));
    }
  }, [avatar]);

  function closeComposeDialog() {
    teamsDialog.type === "edit"
      ? dispatch(Actions.closeEditTeamsDialog())
      : dispatch(Actions.closeNewTeamsDialog());
  }

  
   // Handler for toggling isactif
   const handleToggleIsActif = (event) => {
    console.log('Toggling isactif to:', event.target.checked); // Debug statement
    setForm({ ...form, isactif: event.target.checked });
  }; 


  function handleSubmit(event) {
    if (form.societe === "" ||
        form.firstName === "" ||
        form.lastName === "" ||
        form.phone === "" ||
        form.email === "" ||
        (teamsDialog.type === "new" && (form.password === "" || form.confirmpassword === ""))
       ) {
      // Display error messages if fields are empty
      return;
    }

    if (teamsDialog.type === "new") {
      dispatch(Actions.addTeam(form, user.id));
    } else {
      dispatch(Actions.updateTeam(form, user.id));
    }
    closeComposeDialog();
  }

  function handleRemove() {
    dispatch(Actions.removeTeam(form, user.id));
    dispatch(Actions.closeDialog());
    closeComposeDialog();
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    dispatch(Actions.uploadImage(file));
  }

  return (
    <Dialog
      classes={{ paper: "m-24" }}
      {...teamsDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {teamsDialog.type === "new" ? "Nouveau Acheteur / Master" : form.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        className="flex flex-col overflow-hidden"
      >
        <DialogContent classes={{ root: "p-24" }}>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Société"
              id="societe"
              name="societe"
              value={form.societe}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Nom"
              autoFocus
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Prénom"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Adresse 1"
              id="adresse1"
              name="adresse1"
              value={form.adresse1}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Adresse 2"
              id="adresse2"
              name="adresse2"
              value={form.adresse2}
              onChange={handleChange}
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Code postal"
              id="codepostal"
              type="number"
              name="codepostal"
              value={_.toString(form.codepostal)}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="Téléphone"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              validationErrors={{
                isDefaultRequiredValue: "Ce champ est requis"
              }}
            />
          </div>
          <div className="flex">
            <TextFieldFormsy
              className="mb-24"
              label="E-mail"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              validations="isEmail"
              validationErrors={{
                isEmail: "Ce n'est pas un email valide",
                isDefaultRequiredValue: "Ce champ est requis"
              }}
              required
              fullWidth
            />
          </div>
          {teamsDialog.type === "new" && (
            <div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  type={values.showPassword ? "text" : "password"}
                  name="password"
                  label="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  validations={{
                    minLength: 6,
                  }}
                  validationErrors={{
                    minLength: "Le mot de passe doit contenir au moins 6 caractères",
                    isDefaultRequiredValue: "Ce champ est requis"
                  }}
                />
              </div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  type={values.showPassword ? "text" : "password"}
                  name="confirmpassword"
                  label="Confirmer mot de passe"
                  value={form.confirmpassword}
                  onChange={handleChange}
                  validations={{
                    equalsField: "password",
                  }}
                  validationErrors={{
                    equalsField: "Les mots de passe doivent correspondre",
                    isDefaultRequiredValue: "Ce champ est requis"
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          )}
          {imageReqInProgress ? (
            <div style={{ paddingBottom: 10, paddingTop: 10, textAlign: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            avatar && (
              <div style={{ textAlign: "center", paddingBottom: 10, paddingTop: 10 }}>
                <Avatar src={`${URL_SITE}${avatar}`} style={{ margin: "0 auto", height: "150px", width: "150px" }} />
              </div>
            )
          )}
            <div className="flex items-center">
            <FormControlLabel
              control={<Switch checked={form.isactif} onChange={handleToggleIsActif} />}
              label="Actif"
            />
          </div> *
          <div className="flex">
            <input
              accept="image/*"
              className="hidden"
              id="button-file"
              type="file"
              onChange={handleUploadChange}
            />
            <label htmlFor="button-file">
              <Button
                variant="outlined"
                component="span"
                className="flex flex-1"
                disabled={imageReqInProgress}
              >
                Télécharger une image
              </Button>
            </label>
          </div>
        </DialogContent>
        {teamsDialog.type === "edit" ? (
          <DialogActions className="justify-between p-8">
            <div className="px-16">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Sauvegarder
              </Button>
            </div>
            <IconButton
              className="min-w-auto"
              onClick={handleRemove}
            >
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-8">
            <div className="px-16">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormValid}
              >
                Ajouter
              </Button>
            </div>
          </DialogActions>
        )}
      </Formsy>
    </Dialog>
  );
}

export default TeamsDialog;
