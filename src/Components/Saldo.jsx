import React, {useEffect, useState} from 'react';
import { RestService } from '../Service/RestService'
import Typography from '@material-ui/core/Typography';

export default function Saldo(props){
    const [saldo, setSaldo] = useState()
    const usuarioId = !!props.usuario ? props.usuario.id : null
    const isUser = props.isUser;

    useEffect(() => {
            RestService.GET.getSaldo(usuarioId, isUser)
                .then(response => {
                    setSaldo(response.data)
                })
        }, [isUser, usuarioId]
    )

    return(
        <Typography variant="h6" style={{marginLeft: "65vw"}}>
            Saldo: ${saldo}
        </Typography>
    )
}