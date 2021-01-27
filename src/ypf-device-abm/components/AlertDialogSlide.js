import React from "react";
import {
  Button,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { useStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useAlertStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function AlertDialogSlide({
  open,
  handleClose,
  container,
  handleDelete,
  response,
  error,
  loading,
  hasManyPatents,
}) {
  const classes = useAlertStyles();

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        container={container}
        disableBackdropClick
        style={{ overflowY: "scroll" }}
      >
        {response.length > 0 ? (
          <>
            <DialogTitle id="alert-dialog-slide-title">
              <Typography>
                {response.every((res) => res.success)
                  ? "Baja exitosa"
                  : "Hubo algunos elementos que no pudieron ser eliminados"}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {response.map((res) => (
                  <Typography
                    key={res.data}
                    color={res.success ? "inherit" : "error"}
                  >
                    {res.data}
                  </Typography>
                ))}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Aceptar
              </Button>
            </DialogActions>
          </>
        ) : error.length > 1 ? (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {error}
                <Button
                  onClick={handleClose}
                  color="primary"
                >
                  Aceptar
                </Button>
              </DialogContentText>
            </DialogContent>
          </>
        ) : (
          <>
            <Backdrop
              className={classes.backdrop}
              open={loading}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <DialogTitle id="alert-dialog-slide-title">
              <Typography>Baja dispositivo</Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                ¿Está seguro que desea dar de baja{" "}
                {hasManyPatents ? "los dispositivos" : "el dispositivo"}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDelete} color="secondary">
                Confirmar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
