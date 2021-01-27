import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Grid,
  Button,
  Typography,
  RootRef,
  CircularProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Formik, Form } from "formik";
import SuccessDialog from "./SuccessDialog";
import PropTypes from "prop-types";

import * as Yup from "yup";

const POST_URL = "../interfaces/interfaz_ypf_dispositivos.php";
const patata = {"success":false,"error":"La unidad AB-TEST ya est\u00e1 dada de alta pero aun no se recibieron datos de GPS"};

export default function Create(props) {
  const { transportists, terminals } = props;
  const domRef = useRef(null);
  const [response, setResponse] = useState();
  const [networkError, setNetworkError] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const showError = () => {
    setHasError(true);
    console.log("error",error);
    setTimeout(() => {
      setHasError(false);
    }, 4000);
  }

  useEffect(() => {
    if (response?.success) setOpen(true);
    else if (response?.error) {setError((previous)=>(response.error)); showError();};
  }, [response, setError]);
  

  const postDevice = async (device) => {
    const formData = new FormData();
    formData.append("operation", "alta");
    formData.append("patente", device.patent);
    formData.append("transportista", device.transportist.title);
    formData.append("codigo_transportista", device.transportist.number);
    formData.append("terminal", device.terminal.code);

    try {
      const result = await fetch(POST_URL, {
        method: "POST",
        body: formData,
      });
      const formattedResult = await result.json();
      setResponse(formattedResult);
    } catch (err) {
      setNetworkError(err);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    await postDevice({
      ...values,
    });
    resetForm();
  };

  const validationSchema = Yup.object({
    patent: Yup.string("Escribe una patente")
      .min(6, "¡Demasiado corta!")
      .max(7, "¡Demasiado larga!")
      .required("La patente es requerida"),
    transportist: Yup.object()
      .shape({
        title: Yup.string("Selecciona un transportista").required(),
        number: Yup.number("Número de transportista"),
      })
      .required("El transportista es requerido"),
    terminal: Yup.object()
      .shape({
        title: Yup.string("Selecciona una terminal").required(),
        code: Yup.number("Código de la terminal"),
      })
      .required("La terminal es requerida"),
  });

  return (
    <div>
      <RootRef rootRef={domRef}>
        <>
          {networkError.length > 0 && (
            <Typography color="error">{networkError}</Typography>
          )}
          <Formik
            initialValues={{
              patent: "",
              transportist: { title: "", number: "" },
              terminal: { title: "", code: "" },
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({
              setFieldValue,
              isSubmitting,
              isValid,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  spacing={7}
                  alignItems="flex-start"
                >
                  <Grid item xs={12}>
                    <Typography style={{ marginBottom: 8 }}>
                      {" "}
                      Ingrese la patente:
                    </Typography>

                    <TextField
                      name="patent"
                      label="Patente"
                      variant="outlined"
                      size="small"
                      style={{ width: 400 }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.patent ? errors.patent : ""}
                      error={touched.patent && Boolean(errors.patent)}
                      value={values.patent}
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ marginBottom: 8 }}>
                      Seleccione el transportista asignado a la unidad:
                    </Typography>
                    <Autocomplete
                      name="transportist"
                      id="combo-box-transportist"
                      options={transportists}
                      getOptionLabel={(option) =>
                        option.number
                          ? "(" + option.number + ") " + option.title
                          : ""
                      }
                      size="small"
                      style={{ width: 400 }}
                      disablePortal={true}
                      onChange={(e, value) => {
                        setFieldValue("transportist", value);
                      }}
                      value={values.transportist}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Transportista"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ marginBottom: 8 }}>
                      Seleccione la terminal asignada a la unidad:
                    </Typography>
                    <Autocomplete
                      name="terminal"
                      id="combo-box-terminal"
                      options={terminals}
                      getOptionLabel={(option) => option.title}
                      size="small"
                      style={{ width: 400 }}
                      disablePortal={true}
                      onChange={(e, value) => {
                        setFieldValue("terminal", value);
                      }}
                      value={values.terminal}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Terminal"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting || !isValid}
                    >
                      Confirmar
                      {isSubmitting && (
                        <CircularProgress
                          color="inherit"
                          size={18}
                          style={{ marginLeft: 10 }}
                        ></CircularProgress>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          {hasError && (
            <Typography color="error" style={{ marginTop: 10 }}>
              {error}
            </Typography>
          )}

          <SuccessDialog
            open={open}
            handleClose={handleClose}
            dialogContent="Dispositivo guardado con éxito"
            dialogTitle="Guardado"
            container={domRef.current}
          ></SuccessDialog>
        </>
      </RootRef>
    </div>
  );
}

Create.defaultProps = {};

Create.propTypes = {
  transportists: PropTypes.array,
  terminals: PropTypes.array,
};
