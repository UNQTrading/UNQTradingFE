import React, {useEffect, useState} from 'react';
import { RestService } from '../../Service/RestService'
import {Paper} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import TableFooter from "@material-ui/core/TableFooter";
import TableCell from "@material-ui/core/TableCell";
import withStyles from "@material-ui/core/styles/withStyles";
import blue from "@material-ui/core/colors/blue";

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: blue["900"],
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export default function AccionesTable() {
    const [acciones, handleAcciones] = useState([])
    const [pagina, setPagina] = React.useState(0);
    const [accionesPorPagina, setAccionesPorPagina] = React.useState(5);
    const classes = useStyles2();
    const emptyRows = accionesPorPagina - Math.min(accionesPorPagina, acciones.length - pagina * accionesPorPagina);

    const handleChangePage = (event, newPage) => {
        setPagina(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setAccionesPorPagina(parseInt(event.target.value, 10));
        setPagina(0);
    };

    useEffect(() => {
        RestService.GET.findAccionesByUser(1) // usuario hardcodeado
            .then(response => handleAcciones(response.data))
    }, [])

    return (
         <div className="container row justify-content-center">
             <TableContainer component={Paper}>
                 <Table className={classes.table} aria-label="custom pagination table">
                     <TableHead>
                         <TableRow>
                             <StyledTableCell align="center">Empresa</StyledTableCell>
                             <StyledTableCell align="center">Cantidad</StyledTableCell>
                             <StyledTableCell align="center">Fecha Última Compra</StyledTableCell>
                         </TableRow>
                     </TableHead>
                     <TableBody>
                         {renderAcciones()}
                         {emptyRows > 0 && (
                             <TableRow style={{ height: 53 * emptyRows }}>
                                 <StyledTableCell colSpan={6} />
                             </TableRow>
                         )}
                     </TableBody>
                 </Table>
                 <TableFooter>
                     <TableRow>
                         <TablePagination
                             rowsPerPageOptions={[5, 10]}
                             colSpan={3}
                             count={acciones.length}
                             rowsPerPage={accionesPorPagina}
                             page={pagina}
                             SelectProps={{
                                 inputProps: { 'aria-label': 'rows per pagina' },
                                 native: true,
                             }}
                             onChangePage={handleChangePage}
                             onChangeRowsPerPage={handleChangeRowsPerPage}
                             ActionsComponent={TablePaginationActions}
                         />
                     </TableRow>
                 </TableFooter>
             </TableContainer>
         </div>
    )

    function renderAcciones() {
        return (accionesPorPagina > 0
            ? acciones.slice(pagina * accionesPorPagina, pagina * accionesPorPagina + accionesPorPagina)
            : acciones).map((row) => (
                <StyledTableRow>
                    <StyledTableCell align="center">{row.nombreEmpresa}</StyledTableCell>
                    <StyledTableCell align="center">{row.cantidad}</StyledTableCell>
                    <StyledTableCell align="center">{row.fechaUltimaCompra}</StyledTableCell>
                </StyledTableRow>
        ))
    }
}