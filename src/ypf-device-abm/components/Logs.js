import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

const columns = [
  {
    name: "date",
    label: "Fecha",
    options: {
      sort: true,
    },
  },
  {
    name: "user",
    label: "Usuario",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "name_dispo",
    label: "Dispositivo",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "operation",
    label: "Operacion",
    options: {
      filter: true,
      sort: false,
    },
  },
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
    fontSize: 16,
  },
});

export default function Logs(props) {
  const { logs } = props;

  const classes = useStyles();

  const options = {
    filterType: "checkbox",
    print: false,
    viewColumns: false,
    selectableRows: "none",
    filter: false,
    pagination: true,
    rowsPerPage: 100,
    rowsPerPageOptions: [100],
    tableBodyHeight: "50vh",
    sortOrder: {
      name: "date",
      direction: "desc",
    },
    textLabels: {
      pagination: {
        next: "Proxima pagina",
        previous: "Pagina anterior",
        rowsPerPage: "Filas por pagina:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        filterTable: "Filtro",
      },
    },
  };

  return (
    <MUIDataTable
      title={"Lista de registro de actividades"}
      data={logs}
      columns={columns}
      options={options}
      className={classes.table}
    />
  );
}
