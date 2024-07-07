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
  Chip,
} from "@material-ui/core";
import { useForm } from "@fuse/hooks";
import * as Actions from "./store/actions";
import { useDispatch, useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import Formsy from "formsy-react";
import _ from "@lodash";
import SelectReactFormsy from "@fuse/components/formsy/SelectReactFormsy";


const defaultFormState = {
  firstName: "",
  lastName: "",
  adresse1: "",
  adresse2: "",
  codepostal: null,
  phone: "",
  email: "",
  villes: null,
};

function CommercialsDialog(props) {
  const dispatch = useDispatch();
  const commercialsDialog = useSelector(
    ({ commercialsApp }) => commercialsApp.commercials.commercialsDialog
  );
  const commercials = useSelector(
    ({ commercialsApp }) => commercialsApp.commercials
  );
  const Villes = useSelector(
    ({ commercialsApp }) => commercialsApp.commercials.villes
  );
  const imageReqInProgress = useSelector(
    ({ commercialsApp }) => commercialsApp.commercials.imageReqInProgress
  );
  const avatar = useSelector(
    ({ commercialsApp }) => commercialsApp.commercials.avatar
  );

  const { form, handleChange, setForm } = useForm(defaultFormState);

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (commercialsDialog.type === "edit" && commercialsDialog.data) {
      let villes = commercialsDialog.data.villes.map((item) => ({
        value: item["@id"],
        label: item.name,
      }));
      setForm({ ...commercialsDialog.data });
      setForm(_.set({ ...commercialsDialog.data }, "villes", villes));
    }
  }, [commercialsDialog.data, commercialsDialog.type, setForm]);

  useEffect(() => {
    if (
      commercials.error &&
      (commercials.error.firstName ||
        commercials.error.lastName ||
        commercials.error.adresse1 ||
        commercials.error.adresse2 ||
        commercials.error.codepostal ||
        commercials.error.phone ||
        commercials.error.email ||
        commercials.error.villes)
    ) {
      formRef.current.updateInputsWithError({
        ...commercials.error,
      });

      disableButton();
      commercials.error = null;
    }
  }, [commercials.error]);

  useEffect(() => {
    /**
     * After Dialog Open
     */
    if (commercialsDialog.props.open) {
      initDialog();
    }
  }, [commercialsDialog.props.open, initDialog]);

  useEffect(() => {
    if (avatar) {
      setForm(_.set({ ...form }, "avatar", avatar));
    } else {
      setForm(_.set({ ...form }, "avatar", null));
    }
  }, [avatar]);

  function closeComposeDialog() {
    // commercialsDialog.type === 'edit' ? dispatch(Actions.closeEditcommercialsDialog()) : '';
    dispatch(Actions.closeEditCommercialsDialog());
  }

  function handleSubmit(event) {
    form.codepostal = _.parseInt(form.codepostal);

    //event.preventDefault();
    if (commercialsDialog.type === "edit") {
      dispatch(Actions.updateCommercial(form));
    }
  }

  function handleRemove() {
    dispatch(Actions.removeCommercial(form));
    dispatch(Actions.closeDialog());
    closeComposeDialog();
  }
  function handleChipChange(value, name) {
    //setForm(_.set({...form}, name, value.map(item => item.value)));
    setForm(_.set({ ...form }, name, value));
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
      classes={{
        paper: "m-24",
      }}
      {...commercialsDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={1}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {commercialsDialog.type === "new"
              ? "Nouvelle Commercial"
              : "Editer Commercial"}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          {imageReqInProgress ? (
            <Avatar className="">
              <CircularProgress size={24} />
            </Avatar>
          ) : (
            <Avatar
              className="w-96 h-96"
              alt="contact avatar"
              src={
                form.avatar
                  ? URL_SITE + form.avatar.url
                  : "assets/images/avatars/images.png"
              }
            />
          )}

          {commercialsDialog.type === "edit" && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {form.firstName}&ensp;
              {form.lastName}
            </Typography>
          )}
          {form.parent1 && (
            <Chip
              avatar={
                <Avatar
                  alt="Natacha"
                  src={
                    form.parent1.avatar
                      ? URL_SITE + form.parent1.avatar.url
                      : "assets/images/avatars/images.png"
                  }
                />
              }
              label={
                "Admin: " + form.parent1.firstName + " " + form.parent1.lastName
              }
              variant="outlined"
              color="secondary"
            />
          )}
        </div>
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
              label="Nom"
              autoFocus
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              variant="outlined"
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
              }}
              required
              fullWidth
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
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
              }}
              required
              fullWidth
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
              validations={{
                minLength: 6,
              }}
              validationErrors={{
                minLength: "La longueur minimale des caractères est de 6",
              }}
              required
              fullWidth
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
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: "La longueur minimale des caractères est de 6",
              }}
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
              validations={{
                minLength: 4,
                isNumeric: true,
              }}
              validationErrors={{
                minLength: "Min character length is 4",
                isNumeric: "Numeric value required",
              }}
              required
              fullWidth
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
              validations={{
                minLength: 10,
                isNumeric: true,
              }}
              validationErrors={{
                minLength: "Min character length is 10",
                isNumeric: "Numeric value required",
              }}
              required
              fullWidth
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
                isEmail: "This is not a valid email",
              }}
              required
              fullWidth
            />
          </div>

          {commercialsDialog.type === "new" ? (
            <div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  type="password"
                  name="password"
                  label="Mot de passe"
                  onChange={handleChange}
                  validations={{
                    minLength: 6,
                  }}
                  validationErrors={{
                    minLength: "La longueur minimale des caractères est de 6",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="text-20" color="action">
                          vpn_key
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  required
                  fullWidth
                />
              </div>
              <div className="flex">
                <TextFieldFormsy
                  className="mb-24"
                  id="confirmpassword"
                  type="password"
                  name="confirmpassword"
                  label="Confirmer mot de passe"
                  validations="equalsField:password"
                  onChange={handleChange}
                  validationErrors={{
                    equalsField: "Passwords not identique",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className="text-20" color="action">
                          vpn_key
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="flex">
            <SelectReactFormsy
              id="villes"
              name="villes"
              className="MuiFormControl-fullWidth MuiTextField-root mb-24"
              value={form.villes}
              onChange={(value) => handleChipChange(value, "villes")}
              placeholder="Sélectionner multiple villes"
              textFieldProps={{
                label: "Villes",
                InputLabelProps: {
                  shrink: true,
                },
                variant: "outlined",
              }}
              options={Villes}
              fullWidth
              isMulti
              required
            />
          </div>
          <div className="flex">
            <input
              accept="image/*"
              id="button-file"
              type="file"
              onChange={handleUploadChange}
            />
          </div>
        </DialogContent>

        {commercialsDialog.type === "new" ? (
          <DialogActions className="justify-between pl-16">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                !isFormValid || commercials.loading || imageReqInProgress
              }
            >
              Ajouter
              {commercials.loading && <CircularProgress size={24} />}
            </Button>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between pl-16">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                !isFormValid || commercials.loading || imageReqInProgress
              }
            >
              Modifier
              {commercials.loading && <CircularProgress size={24} />}
            </Button>
            <IconButton
              onClick={() =>
                dispatch(
                  Actions.openDialog({
                    children: (
                      <React.Fragment>
                        <DialogTitle id="alert-dialog-title">
                          Suppression
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Voulez vous vraiment supprimer cet enregistrement ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => dispatch(Actions.closeDialog())}
                            color="primary"
                          >
                            Non
                          </Button>
                          <Button
                            onClick={handleRemove}
                            color="primary"
                            autoFocus
                          >
                            Oui
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    ),
                  })
                )
              }
            >
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </Formsy>
    </Dialog>
  );
}

export default CommercialsDialog;
