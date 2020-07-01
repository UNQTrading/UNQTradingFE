import React, {useState, useEffect, useRef} from 'react';
import { useForm } from '../Common/GenericHookForm.jsx'
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Card, CardContent, Grid, AppBar, Toolbar, Typography} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { properties } from "../../Properties/properties.js"
import { formStyles } from "../MaterialDesign/Styles"
import { RestService } from '../../Service/RestService.js';
import { TerminosYCondiciones } from "../Common/TerminosYCondiciones.jsx";

export default function RegistroForm(props) {

    const { values, bind } = useForm({
        username: "",
        password: "",
        confirmarPass: "",
        nombre: "",
        apellido: "",
        email: "",
        confirmarEmail: "",
        dni: "",
        cuil: ""
      });

    const message = "El campo no puede estar vacío"
    const success = {visible: false, message: ''}
    const failed = {visible: true, message: message}
    const [errorPass, setErrorPass] = useState({visible: false, message: ''})
    const [errorConfirmarPass, setErrorConfirmarPass] = useState({visible: false, message: ''})
    const [errorUsername, setErrorUsername] = useState(success)
    const [errorNombre, setErrorNombre] = useState(success)
    const [errorApellido, setErrorApellido] = useState(success)
    const [errorDni, setErrorDni] = useState(success)
    const [errorEmail, setErrorEmail] = useState({visible: false, message: ''})
    const [errorConfirmarEmail, setErrorConfirmarEmail] = useState({visible: false, message: ''})
    const [errorCuil, setErrorCuil] = useState({visible: false, message: ''})
    const [accept, setAccept] = useState(false)
    const [show, setShow] = useState(false)
    const [alert, setAlert] = useState({ show: false, variant: "danger", message: '', icon: false });
    const classes = formStyles();
    const hasErrors = useRef(true);

    useEffect(() => {
        hasErrors.current = (verifyFields(values));
    }, [values]);

    function verifyFields(values) {
        let error = false
        for (let i = 0; i < Object.values(values).length - 1; i++) {
            if (Object.values(values)[i] === "") {
                error = true
            }   
        }
        return error
    }

    return (
        <div>
            <Grid container direction="row">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {properties.labels.registroPersonaTitle}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center">
                <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '80vh' }}>
                    <Card className={classes.root}>
                        <Grid container direction="column" alignItems="center" justify="center" style={{ marginTop: "10px" }}>
                            <img src={require('../../Images/logo100.png')} alt="UNQTrading Logo" width="100" height="87" />
                        </Grid>
                            <CardContent>
                                <form className={classes.root}>
                                    <div>           
                                        <TextField
                                            {...bind}
                                            id="nombre"
                                            label="Nombre"
                                            variant="outlined"
                                            error = {errorNombre.visible}
                                            onBlur = {e => setErrorNombre(e.target.value === '' ? failed : success)}
                                            helperText= {errorNombre.message}
                                            type="text" />
                                        <TextField
                                            {...bind}
                                            id="apellido"
                                            label="Apellido"
                                            variant="outlined"
                                            error = {errorApellido.visible}
                                            onBlur = {e => setErrorApellido(e.target.value === '' ? failed : success)}
                                            helperText= {errorApellido.message}
                                            type="text" />
                                        <TextField
                                            {...bind}
                                            id="dni"
                                            label="DNI"
                                            variant="outlined"
                                            error = {errorDni.visible}
                                            onBlur = {e => setErrorDni(e.target.value === '' ? failed : success)}
                                            helperText= {errorDni.message}
                                            type="number" />
                                    </div>
                                    <div>
                                        <TextField
                                            {...bind}
                                            id="cuil"
                                            label="CUIL"
                                            variant="outlined"
                                            error = {errorCuil.visible}
                                            onBlur = {e => handleErrorCuil(e.target.value)}
                                            helperText= {errorCuil.message}
                                            type="number" />
                                        <TextField
                                            {...bind}
                                            id="email"
                                            label="Email"
                                            variant="outlined"
                                            error = {errorEmail.visible}
                                            onBlur = {e => handleErrorEmail(e.target.value)}
                                            helperText= {errorEmail.message}
                                            type="mail" />
                                        <TextField
                                            {...bind}
                                            id="confirmarEmail"
                                            label="Confirmar Email"
                                            variant="outlined"
                                            error = {errorConfirmarEmail.visible}
                                            onBlur = {e => handleErrorConfirmarEmail(e.target.value)}
                                            helperText= {errorConfirmarEmail.message}
                                            type="mail" />
                                    </div>
                                    <div>
                                        <TextField
                                            {...bind}
                                            id="username"
                                            label="Nombre de usuario"
                                            variant="outlined"
                                            type="text" 
                                            error = {errorUsername.visible}
                                            onBlur = {e => setErrorUsername(e.target.value === '' ? failed : success)}
                                            helperText= {errorUsername.message}/>
                                        <TextField
                                            {...bind}
                                            id="password"
                                            label="Contraseña"
                                            variant="outlined"
                                            type="password"
                                            value = {useForm.password}
                                            error = {errorPass.visible}
                                            onBlur = {e => handleErrorPass(e.target.value)}
                                            helperText= {errorPass.message}/>
                                        <TextField
                                            {...bind}
                                            id="confirmarPass"
                                            label="Confirmar contraseña"
                                            variant="outlined"
                                            type="password"
                                            error= {errorConfirmarPass.visible}
                                            onBlur = {e => handleErrorConfirmarPass(e.target.value)}
                                            helperText= {errorConfirmarPass.message}/>
                                    </div>
                                </form>
                            <FormControlLabel className="p-2"
                                control={<Checkbox checked={accept} onChange={event => setAccept(event.target.checked)}/>}
                                label = {<Button style= {{ textTransform:'none'}} value="justify" onClick={() => setShow(true)}>
                                        {properties.labels.aceptarTerminos}
                                        </Button>}/>
                            <div>
                                <Dialog
                                    open={show}
                                    onClose={() => setShow(false)}
                                    scroll="body">
                                    <DialogTitle id="scroll-dialog-title">{properties.labels.terminosTitle}</DialogTitle>
                                        <DialogContent dividers={true}>
                                            <TerminosYCondiciones/>
                                        </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setShow(false)} color="primary">
                                            {properties.labels.cerrar}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <div>
                                <Button disabled={!accept || hasErrors.current} className="p-2 ml-1" variant="contained" color="primary" onClick={() => register()}>
                                    {properties.labels.registrar}
                                </Button>
                            </div>
                            <Alert className="mt-2" variant={alert.variant} severity={alert.severity} icon={alert.icon}>
                                {alert.message}
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );

    function handleErrorEmail(value) {
        if (value === "") {
            setErrorEmail({
                visible: true,
                message: message
            })
        } else if (!isValid(value)) {
            setErrorEmail({
                visible: true,
                message: "El formato del email es incorrecto"
            })       
        } else {
            setErrorEmail({
                visible: false,
                message: ""
            })
        }
    }

    function handleErrorConfirmarEmail(value) {

        let email = Object.values(values)[5]
        let matchEmail = Object.values(values)[6]

        if (value === "") {
            setErrorConfirmarEmail({
                visible: true,
                message: message
            })
        } else if (email !== matchEmail) {
            setErrorConfirmarEmail({
                visible: true,
                message: "La dirección de email no coincide"
            })       
        } else {
            setErrorConfirmarEmail({
                visible: false,
                message: ""
            })
        }
    }

    function handleErrorCuil(value) {
        if (value === "") {
            setErrorCuil({
                visible: true,
                message: message
            })
        } else if (value.length !== 11) {
            setErrorCuil({
                visible: true,
                message: "El cuil debe tener 11 caracteres"
            })       
        } else {
            setErrorCuil({
                visible: false,
                message: ""
            })
        }
    }

    function handleErrorPass(value) {
        if (value === "") {
            setErrorPass({
                visible: true,
                message: message
            })
        } else if (value.length < 6) {
            setErrorPass({
                visible: true,
                message: "La contraseña debe tener al menos 6 caracteres"
            })       
        } else {
            setErrorPass({
                visible: false,
                message: ''
            })
        }
    }

    function handleErrorConfirmarPass(value) {

        let pass = Object.values(values)[1]
        let matchPass = Object.values(values)[2]

        if (value === "") {
            setErrorConfirmarPass({
                visible: true,
                message: message
            })
        } else if (pass !== matchPass) {
            setErrorConfirmarPass({
                visible: true,
                message: "La contraseña no coincide"
            })       
        } else if (value.length < 6) {
            setErrorConfirmarPass({
                visible: true,
                message: "La contraseña debe tener al menos 6 caracteres"
            })       
        } else {
            setErrorConfirmarPass({
                visible: false,
                message: ''
            })
        }
    }

    function register() {
        let user = Object.values(values)[0]
        let nombre = Object.values(values)[3]
        let apellido = Object.values(values)[4]
        let dni = Object.values(values)[7]
        let cuil = Object.values(values)[8]
        let email = Object.values(values)[5]
        let pass = Object.values(values)[1]

        if (verifyPass() && verifyEmail() && verifyCuil())
        {
            RestService.POST.saveUsuario({
                nombre : nombre,
                apellido: apellido,
                username : user,
                password : pass,
                email : email,
                dni : dni,
                cuil : cuil
            }).then(() => {
                setAlert({
                    show: true,
                    variant: "filled",
                    severity: "success",
                    message: "Registro exitoso!!"
                })
                setTimeout(() => {
                    props.history.push('/LoginPersona')
                }, 3000)
            }).catch((error) => {
                setAlert({
                    show: true,
                    severity: "error",
                    variant: "filled",
                    message: error.response.data.message
                })
            })
        }
    }

    function verifyEmail(){
        let email = Object.values(values)[5]
        let matchEmail = Object.values(values)[6]

        if(email !== matchEmail || !isValid(email)){
            setAlert({
                show: true,
                severity: "warning",
                variant: "filled",
                message: "El email ingresado es erroneo o no coincide"
            })
            return false
        }
        return true
    }

    function verifyPass(){
        let pass = Object.values(values)[1]
        let matchPass = Object.values(values)[2]

        if(pass !== matchPass){
            setAlert({
                show: true,
                severity: "warning",
                variant: "filled",
                message: "La contraseña ingresada no coincide"
            })
            return false
        }
        
        if(pass.length < 6){
            setAlert({
                show: true,
                severity: "warning",
                variant: "filled",
                message: "La contraseña debe tener al menos 6 caracteres "
            })
            return false
        }
        return true
    }

    function verifyCuil(){
        let cuil = Object.values(values)[8]

        if(cuil.length !== 11){
            setAlert({
                show: true,
                severity: "warning",
                variant: "filled",
                message: "El cuil debe tener 11 caracteres"
            })
            return false
        }
        return true
    }

    function isValid(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}


