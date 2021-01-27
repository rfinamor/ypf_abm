import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Grid,
  TextField,
  Button,
  RootRef,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Papa from "papaparse";
import AlertDialogSlide from "./AlertDialogSlide";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  hideMe: {
    display: "none",
  },
}));

const DELETE_URL = "../interfaces/interfaz_ypf_dispositivos.php";

export default function Delete(props) {
  const { patents } = props;
  const classes = useStyles();
  const domRef = useRef();

  const uploadInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [patentToBeDeleted, setPatentToBeDeleted] = useState("");
  const [response, setResponse] = useState([]);

  const [csvData, setCsvData] = useState([]);

  const [file, setFile] = useState();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const hasManyPatents = useMemo(() => csvData.length > 0, [csvData]);
  const submitDisabled = useMemo(() => !patentToBeDeleted && !hasManyPatents, [
    patentToBeDeleted,
    hasManyPatents,
  ]);

  useEffect(() => {
    if (!file) return;
    const parseText = async () => {
      const text = await file.text();
      const parsed = Papa.parse(text);
      const array = parsed.data
        .map((array) => array[0])
        .filter((patent) => patent.length > 4);
      setCsvData(array);
    };

    parseText();
  }, [file]);

  const handleClose = () => {
    setResponse([]);
    setError("");
    setOpen(false);
    cleanInputs();
  };

  const cleanInputs = () => {
    setPatentToBeDeleted("");
    setFile(null);
    setCsvData([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const deleteDevices = async (patents) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("operation", "baja");
      formData.append("patentes", patents);
      const result = await fetch(DELETE_URL, {
        method: "POST",
        body: formData,
      });
      const formmatedResult = await result.json();
      setResponse(formmatedResult);
      setLoading(false);
    } catch (requestError) {
      if (!response) {
        setError("Not found");
      }
      setLoading(false);
      setError(requestError.message);
    }
  };

  const handleDelete = async () => {
    if (hasManyPatents) {
      // [1,2,3]
      deleteDevices(csvData);
    } else {
      deleteDevices([patentToBeDeleted.title]);
    }
  };

  const handleChange = (_, value) => {
    setPatentToBeDeleted(value);
  };

  const handleUploadData = () => {
    uploadInputRef.current.click();
  };

  const handleDeleteFile = () => {
    uploadInputRef.current.value = "";
    setFile(null);
    setCsvData([]);
  };

  return (
    <div>
      <RootRef rootRef={domRef}>
        <Grid
          container
          direction="column"
          justify="center"
          spacing={2}
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            {!hasManyPatents && (
              <>
                <Typography style={{ marginBottom: 8 }}>
                  Seleccione la patente:
                </Typography>
                <Autocomplete
                  id="combo-box-patent"
                  options={patents}
                  getOptionLabel={(option) =>
                    option.title ? option.title : ""
                  }
                  size="small"
                  style={{ width: 400 }}
                  disablePortal={true}
                  onChange={handleChange}
                  value={patentToBeDeleted}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Patente dispositivo"
                      variant="outlined"
                    />
                  )}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            <input
              ref={uploadInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              id="csv"
              name="csvInput"
              accept=".csv"
              className={classes.hideMe}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUploadData}
              style={{ marginTop: 90 }}
              disabled={Boolean(patentToBeDeleted)}
            >
              Subir archivo para eliminación masiva
            </Button>
            {file?.name ? (
              <div>
                <Typography>
                  Archivo subido {file.name}
                  <Button
                    variant="outlined"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteFile}
                    style={{ marginLeft: 10 }}
                  >
                    Borrar
                  </Button>
                </Typography>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              disabled={submitDisabled}
              style={{ marginTop: 90 }}
            >
              Baja
            </Button>
            <AlertDialogSlide
              open={open}
              handleClose={handleClose}
              container={domRef.current}
              handleDelete={handleDelete}
              response={response}
              error={error}
              loading={loading}
              hasManyPatents={hasManyPatents}
            />
          </Grid>
        </Grid>
      </RootRef>
    </div>
  );
}

Delete.defaultProps = {};

Delete.propTypes = {
  patents: PropTypes.array,
};
