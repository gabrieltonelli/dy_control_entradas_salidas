Consideraciones de diseño y validacion.

Es un formulario de entrada de datos, por lo tanto debe ser lo mas simple posible.

se debe adaptar a pantallas en celulares y en computadoras.

Los items de articulos y documentos deben quedar asociados por idMovimiento con su cabecera de movimiento

usuario_app es el email del usuario que esta utilizando la aplicacion. Debe ser el mismo que se utiliza en Office 365.


A continuacion se detallan consideraciones de diseño y validacion que deben tenerse en cuenta al momento de desarrollar el sistema:

El siguiente código Power Fx fue extraido de la Power App y debe ser adaptado al nuevo sistema:

```powerapps
Set(
    _showErrors;
    true
);;


// Validador propio (sin depender de Form.Valid)
Set(
    _esValido;
    And(
        !IsBlank(FormMovimientos.Updates.motivo) 
            && Lower(Text(FormMovimientos.Updates.motivo)) <> Lower("-- Seleccione --");
        !IsBlank(FormMovimientos.Updates.idLugarOrigen);
        !IsBlank(FormMovimientos.Updates.idLugarDestino);
        // EXACTAMENTE uno de los dos (XOR):
        (IsBlank(FormMovimientos.Updates.personaInterna) 
            <> IsBlank(FormMovimientos.Updates.idPersonaExterna));
        !IsBlank(_legajoAutorizante);
        ComboBoxDestino.Selected.esDependencia || (!ComboBoxDestino.Selected.esDependencia && !IsBlank(InputDestinoDetalle.Text));
        !IsBlank(fechaAutorizada.SelectedDate);
        !(fechaAutorizada.SelectedDate < Today());
        !(fechaAutorizada.SelectedDate > DateAdd(Today(); 10; TimeUnit.Days));
        !IsBlank(ComboBoxDestino.Selected.id);
        !(ComboBoxDestino.Selected.id = ComboBoxOrigen.Selected.id)

    )
);;
//Notify("_esValido"&_esValido);;




Set(
    _updatesJson;
    JSON(FormMovimientos.Updates; JSONFormat.IndentFour)
);;

If(
    !_esValido;

    
    Set(_mensajeError; "");;

    If(
        IsBlank(FormMovimientos.Updates.motivo)
            || Lower(Text(FormMovimientos.Updates.motivo)) = "-- seleccione --";
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe seleccionar un motivo."
        )
    );;

    If(
        IsBlank(FormMovimientos.Updates.idLugarOrigen);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe seleccionar un origen."
        )
    );;

    If(
        IsBlank(FormMovimientos.Updates.idLugarDestino);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe seleccionar un destino."
        )
    );;

    If(
        IsBlank(FormMovimientos.Updates.personaInterna)
            = IsBlank(FormMovimientos.Updates.idPersonaExterna);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe elegir la persona a autorizar."
        )
    );;

    If(
        IsBlank(_legajoAutorizante);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe indicar la persona autorizante."
        )
    );;

    If(
        ComboBoxDestino.Selected.esDependencia = false
            && IsBlank(InputDestinoDetalle.Text);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Cuando el destino es Exteriores, debe escribir un detalle."
        )
    );;

    If(
        IsBlank(fechaAutorizada.SelectedDate);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe seleccionar una fecha autorizada."
        )
    );;

    If(
        !IsBlank(fechaAutorizada.SelectedDate) 
            && fechaAutorizada.SelectedDate < Today();
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• La fecha autorizada no puede ser menor a hoy."
        )
    );;

    If(
        !IsBlank(fechaAutorizada.SelectedDate)
            && fechaAutorizada.SelectedDate > DateAdd(Today(); 10; TimeUnit.Days);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• La fecha autorizada no puede ser mayor a 10 días."
        )
    );;

    If(
        IsBlank(ComboBoxDestino.Selected.id);
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• Debe seleccionar un destino válido."
        )
    );;

    If(
        !IsBlank(ComboBoxDestino.Selected.id)
            && ComboBoxDestino.Selected.id = ComboBoxOrigen.Selected.id;
        Set(
            _mensajeError;
            _mensajeError & Char(10) & "• El origen y el destino deben ser distintos."
        )
    );;

    // 3) Si hay errores acumulados, los muestro en el Notify en forma amable
    If(
        _mensajeError <> "";
        Notify(
            "No pudimos generar la solicitud. Por favor revise:" & _mensajeError;
            NotificationType.Error
        )
    );;

    If(
        _mensajeError <> "";
        Notify(
            "No pudimos generar la solicitud. Por favor revise:" & _mensajeError;
            NotificationType.Error
        )
    );
    
    // Si es válido, chequeo si autorizante = interna
    If(
        FormMovimientos.Updates.personaInterna = _legajoAutorizante;

        // Mostrar popup de confirmación y NO enviar todavía
        Set(varConfirmVisible; true);; 
        
        //Notify("Llega con varShowConfirm="&varConfirmVisible; NotificationType.Error);;
        Set(varConfirmMessage; "Está a punto de enviar una solicitud donde la Persona autorizante es la misma que la Persona a autorizar. ¿Confirma?.");

        Set(varLoaderVisible;true);;
        // Si NO son iguales, enviar directo
        IfError(SubmitForm(FormMovimientos); false)
    )

)
```

debe soportar autenticacion con Microsoft 365 para cuentas corporativas @donyeyo.com.ar

cargar los datos maestros en memoria cache para optimizar el rendimiento

La base de datos es un MySQL 8 en AWS RDS

A continuacion comparto el script que se ejecuta al enviar el formulario:

```powerapps
If(
    _esValido;
     //obtener id del movimiento insertado
    Set( _idCreado; Value('PowerAppV2->Obtenerfilas'.Run().ultimo_id) );;

    //numeracion unica entero para id articulo 
    Set(_nextIdArticulo; Value( Right( Text( Round((Today() - Date(1970;1;1)) * 86400000; 0)); 8 ));;);; 
    IfError(
        ForAll(
            colArticulosDraft;
            Patch(
                'Acceso_A_Planta.articulos';
                Defaults('Acceso_A_Planta.articulos');
                {
                    id: _nextIdArticulo;
                    idMovimiento: _idCreado;
                    codigoERP: Blank();
                    codigoQR: Blank();
                    codigoBarras: Blank();
                    codigoOtro: Blank();
                    descripcion: descripcion;
                    cantidad: cantidad;
                    idEstado: idEstado;
                    idLugarOrigen: idLugarOrigen;
                    idLugarDestino: idLugarDestino;
                    remitente: remitente;
                    destinatario: destinatario;
                    sinRetorno: sinRetorno;
                    presentacion: presentacion;
                    observacion: observacion;
                    // Extras
                    usuario_app: User().Email;
                    vigilador: ""
                }
            );;
            _nextIdArticulo = _nextIdArticulo + 1
        )
    ; false);;

    //numeracion unica entero para id documento 
    Set(_nextIdDocumento; Value( Right( Text( Round((Today() - Date(1970;1;1)) * 86400000; 0)); 8 ));;);; 
    IfError(
        ForAll(
            colDocumentosDraft;
            Patch(
                'Acceso_A_Planta.documentos';
                Defaults('Acceso_A_Planta.documentos');
                {
                    id: _nextIdArticulo;
                    idMovimiento: _idCreado;
                    tipo: tipo;
                    descripcion: descripcion;
                    cantidad: cantidad;
                    idEstado: idEstado;
                    idLugarOrigen: idLugarOrigen;
                    idLugarDestino: idLugarDestino;
                    remitente: remitente;
                    destinatario: destinatario;
                    sinRetorno: sinRetorno;
                    observacion: observacion;
                    // Extras
                    usuario_app: User().Email;
                    vigilador: ""
                }
            );;
            _nextIdDocumento = _nextIdDocumento + 1
        )
    ; false);;

    //Si es un movimiento con regreso y se trata de un tipo de movimiento que implica una salida (persona o cosa), ejecuto el Store Procedure desde un FLow, el cual crea los movimientos derivados si es necesario (las condiciones se evaluan allí)
    If(checkConRegreso.Value = true && ComboBoxMovimientoTipo.Selected.direccion = "saliente"; 
        EjecutarStoreProceduresp_GenerarMovimientosDerivados.Run(_idCreado)
    );;

    Notify(
        "Solicitud generada correctamente"
        ;
        NotificationType.Success
    );;
    Set(
        varLoaderVisible;
        false
    );;
    Navigate(scrConfirmacion; ScreenTransition.Fade)
)
```
