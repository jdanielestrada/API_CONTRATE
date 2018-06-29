var express = require('express');
var router = express.Router();
var email = require('emailjs');
var pdf = require('html-pdf');
var _ = require('underscore')._;
var fs = require('fs');
var CONSTANTES = require('../../utils/constantes');
var crypto = require('crypto');
var config = require('../../utils/config');
var utils = require('../../utils/utils');
var sql = require('mssql');
var async = require('async');

router.get('/get_m_licencias', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;

        request.execute('SSP_GET_M_LICENCIAS', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.get('/get_m_marcas', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;

        request.execute('SSP_GET_M_MARCAS', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.get('/get_m_versiones_licencias', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;

        request.execute('SSP_GET_M_VERSIONES_LICENCIAS', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.get('/get_m_componentes_hardware', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;

        request.execute('SSP_GET_M_COMPONENTES_HARDWARE', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.get('/get_data_by_placa/:placa', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;
        request.input("IN_PLACA", sql.VarChar, req.params.placa);

        request.execute('SSP_GET_DATA_BY_PLACA', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.get('/get_data_by_cedula/:cedula', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);
    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            res.json(err);
        }

        // Stored Procedure
        var request = new sql.Request(connection);
        //request.verbose = true;
        request.input("IN_CEDULA", sql.BigInt, req.params.cedula);

        request.execute('SSP_GET_DATA_BY_CEDULA', function (err, recordsets, returnValue) {
            if (err) {
                res.json(err);
            }

            res.json({
                data: recordsets
            });
        });

    });
});
router.post('/delete_registro_placa', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);

    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
    });
    var transaction = new sql.Transaction(connection);

    transaction.begin(function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            //res.status(err.status || 500);
            res.json({
                error: err,
                MSG: err.message
            });
        }

        // Stored Procedure
        var request = new sql.Request(transaction);

        //request.verbose = true;
        request.input("IN_PLACA", sql.VarChar, req.body.placa);
        request.output("MSG", sql.VarChar);

        request.execute('SSP_DELETE_REGISTRO_PLACA', function (err, recordsets, returnValue) {
            if (err) {
                res.json({
                    error: err,
                    MSG: err.message
                });
                transaction.rollback(function (err) {
                    // ... error checks
                    return;
                });
            } else {

                if (request.parameters.MSG.value != "OK") {
                    //res.status(500);
                    res.json({
                        error: "err",
                        MSG: request.parameters.MSG.value

                    });
                    transaction.rollback(function (err2) {
                        // ... error checks

                    });
                } else {
                    
                    /*hacemos commit*/
                    transaction.commit(function (err, recordset) {
                        // ... error checks
                        res.json({
                            data: [],
                            'MSG': request.parameters.MSG.value
                        });

                        console.log("Transaction commited.");
                    });
                }
            }
        });
    });
});

router.post('/insert_nueva_placa', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);

    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
    });
    var transaction = new sql.Transaction(connection);

    transaction.begin(function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            //res.status(err.status || 500);
            res.json({
                error: err,
                MSG: err.message
            });
        }

        // Stored Procedure
        var request = new sql.Request(transaction);

        //request.verbose = true;
        request.input("IN_PLACA", sql.VarChar, req.body.placa);
        request.input("IN_CEDULA", sql.VarChar, req.body.obj_data_empleado.cedula);
        request.input("IN_NOMBRES", sql.VarChar, req.body.obj_data_empleado.nombres);
        request.input("IN_DEPARTAMENTO", sql.VarChar, req.body.obj_data_empleado.departamento);
        request.input('IN_USUARIO_DOMINIO', sql.VarChar, req.body.obj_data_empleado.usuario_dominio);
        request.input("IN_CONTRASENA_USUARIO_DOMINIO", sql.VarChar, req.body.obj_data_empleado.contrasena_usuario_dominio);
        request.input("IN_IP_LOCAL", sql.VarChar, req.body.obj_data_empleado.ip_local);
        request.input("IN_USUARIO_FORTIGATE", sql.VarChar, req.body.obj_data_empleado.usuario_fortigate);
        request.input("IN_CONTRASENA_USUARIO_FORTIGATE", sql.VarChar, req.body.obj_data_empleado.contrasena_usuario_fortigate);
        request.input("IN_ROL", sql.VarChar, req.body.obj_data_empleado.rol);

        request.input("IN_USUARIO_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.usuario);
        request.input("IN_CONTRASENA_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.contrasena);
        request.input("IN_BACKUP_CORREO_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.backup);
        request.input("IN_FECHA_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.fecha);
        
        request.output("OUT_C_PLACA", sql.VarChar);
        request.output("MSG", sql.VarChar);

        request.execute('SSP_INSERT_REGISTRO_PLACA', function (err, recordsets, returnValue) {
            if (err) {
                res.json({
                    error: err,
                    MSG: err.message
                });
                transaction.rollback(function (err) {
                    // ... error checks
                    return;
                });
            } else {

                if (request.parameters.MSG.value != "OK") {
                    //res.status(500);
                    res.json({
                        error: "err",
                        MSG: request.parameters.MSG.value

                    });
                    transaction.rollback(function (err2) {
                        // ... error checks

                    });
                } else {

                    let c_placa = request.parameters.OUT_C_PLACA.value;

                    async.series([
                            function(callback) {
                                insert_info_hardware(req.body.list_informacion_hardware, c_placa, transaction, callback);
                            },
                            function(callback) {
                                insert_info_licenciamiento(req.body.list_informacion_licenciamiento, c_placa, transaction, callback);
                            },
                            function (callback) {
                                insert_info_servidor_archivos(req.body.list_informacion_servidor_archivos, c_placa, transaction, callback);
                            },
                            function (callback) {
                                insert_info_mantenimientos(req.body.list_informacion_mantenimientos, c_placa, transaction, callback);
                            }
                        ],
                        function(err, results) {
                            if (err) {

                                res.json({
                                    error: err,
                                    MSG: err
                                });
                                transaction.rollback(function (err) {
                                    // ... error checks
                                    return;
                                });

                            } else {

                                /*hacemos commit*/
                                transaction.commit(function (err, recordset) {
                                    // ... error checks
                                    res.json({
                                        data: [],
                                        'MSG': "OK"
                                    });

                                    console.log("Transaction commited.");
                                });
                            }
                        });
                }
            }
        });
    });
});

router.post('/update_placa', function (req, res, next) {

    config.configBD.database = CONSTANTES.CONTRATEDB;
    console.log(config.configBD.database);

    var connection = new sql.Connection(utils.clone(config.configBD), function (err) {
    });
    var transaction = new sql.Transaction(connection);

    transaction.begin(function (err) {
        // ... error checks
        if (err) {
            console.error(err);
            //res.status(err.status || 500);
            res.json({
                error: err,
                MSG: err.message
            });
        }

        // Stored Procedure
        var requestDelete = new sql.Request(transaction);

        requestDelete.input("IN_PLACA", sql.VarChar, req.body.placa_old);
        requestDelete.output("MSG", sql.VarChar);

        requestDelete.execute('SSP_DELETE_REGISTRO_PLACA', function (err, recordsets, returnValue) {
            if (err) {
                res.json({
                    error: err,
                    MSG: err.message
                });
                transaction.rollback(function (err) {
                    // ... error checks
                    return;
                });
            } else {

                if (requestDelete.parameters.MSG.value != "OK") {
                    //res.status(500);
                    res.json({
                        error: "err",
                        MSG: requestDelete.parameters.MSG.value

                    });
                    transaction.rollback(function (err2) {
                        // ... error checks

                    });
                } else {

                    var request = new sql.Request(transaction);
                    //request.verbose = true;
                    request.input("IN_PLACA", sql.VarChar, req.body.placa);
                    request.input("IN_CEDULA", sql.VarChar, req.body.obj_data_empleado.cedula);
                    request.input("IN_NOMBRES", sql.VarChar, req.body.obj_data_empleado.nombres);
                    request.input("IN_DEPARTAMENTO", sql.VarChar, req.body.obj_data_empleado.departamento);
                    request.input('IN_USUARIO_DOMINIO', sql.VarChar, req.body.obj_data_empleado.usuario_dominio);
                    request.input("IN_CONTRASENA_USUARIO_DOMINIO", sql.VarChar, req.body.obj_data_empleado.contrasena_usuario_dominio);
                    request.input("IN_IP_LOCAL", sql.VarChar, req.body.obj_data_empleado.ip_local);
                    request.input("IN_USUARIO_FORTIGATE", sql.VarChar, req.body.obj_data_empleado.usuario_fortigate);
                    request.input("IN_CONTRASENA_USUARIO_FORTIGATE", sql.VarChar, req.body.obj_data_empleado.contrasena_usuario_fortigate);
                    request.input("IN_ROL", sql.VarChar, req.body.obj_data_empleado.rol);

                    request.input("IN_USUARIO_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.usuario);
                    request.input("IN_CONTRASENA_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.contrasena);
                    request.input("IN_BACKUP_CORREO_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.backup);
                    request.input("IN_FECHA_INFO_CORREO", sql.VarChar, req.body.obj_data_informacion_correo.fecha);

                    request.output("OUT_C_PLACA", sql.VarChar);
                    request.output("MSG", sql.VarChar);

                    request.execute('SSP_INSERT_REGISTRO_PLACA', function (err, recordsets, returnValue) {
                        if (err) {
                            res.json({
                                error: err,
                                MSG: err.message
                            });
                            transaction.rollback(function (err) {
                                // ... error checks
                                return;
                            });
                        } else {

                            if (request.parameters.MSG.value != "OK") {
                                //res.status(500);
                                res.json({
                                    error: "err",
                                    MSG: request.parameters.MSG.value

                                });
                                transaction.rollback(function (err2) {
                                    // ... error checks

                                });
                            } else {

                                let c_placa = request.parameters.OUT_C_PLACA.value;

                                async.series([
                                    function (callback) {
                                        insert_info_hardware(req.body.list_informacion_hardware, c_placa, transaction, callback);
                                    },
                                    function (callback) {
                                        insert_info_licenciamiento(req.body.list_informacion_licenciamiento, c_placa, transaction, callback);
                                    },
                                    function (callback) {
                                        insert_info_servidor_archivos(req.body.list_informacion_servidor_archivos, c_placa, transaction, callback);
                                    },
                                    function (callback) {
                                        insert_info_mantenimientos(req.body.list_informacion_mantenimientos, c_placa, transaction, callback);
                                    }
                                ],
                                    function (err, results) {
                                        if (err) {

                                            res.json({
                                                error: err,
                                                MSG: err
                                            });
                                            transaction.rollback(function (err) {
                                                // ... error checks
                                                return;
                                            });

                                        } else {

                                            /*hacemos commit*/
                                            transaction.commit(function (err, recordset) {
                                                // ... error checks
                                                res.json({
                                                    data: [],
                                                    'MSG': "OK"
                                                });

                                                console.log("Transaction commited.");
                                            });
                                        }
                                    });
                            }
                        }
                    });
                }
            }
        });
    });
});

function insert_info_hardware(list_informacion_hardware, c_placa, transaction, callback) {
    
        /*guardamos el registro de los operarios de corte*/
        var cantRegistros = Object.keys(list_informacion_hardware).length;

        if (cantRegistros > 0) {
            async.each(list_informacion_hardware, function (item, callback) {

                var request = new sql.Request(transaction);
                request.verbose = true;

                request.input("IN_C_PLACA", sql.BigInt, c_placa);
                request.input("IN_C_COMPONENTE_HARDWARE", sql.Int, item.c_componente_hardware);
                request.input("IN_C_MARCA", sql.Int, item.c_marca);
                request.input("IN_MODELO", sql.VarChar, item.modelo);
                request.input("IN_SERIAL", sql.VarChar, item.serial);
                request.input("IN_CAPACIDAD", sql.VarChar, item.capacidad);

                request.output("MSG", sql.VarChar);

                    request.execute('SSP_INSERT_DT_INFORMACION_HARDWARE', function(err, recordsets, returnValue) {
                        if (err) {
                            // ... error checks
                            
                            callback(request.parameters.MSG.value);

                        } else if (request.parameters.MSG.value !== "OK") {
                            callback(request.parameters.MSG.value);
                        } else {
                            cantRegistros--;
                            callback();
                        }

                    });
                },
                function (err) {

                    if (err) {
                        return callback({
                            error: "err",
                            MSG: err
                        });
                        
                    } else {

                        if (cantRegistros === 0) {
                            return callback(null, {
                                data: []
                            });
                        }
                    }
                });   
                    
        } else {
            return callback(null, {
                data: []
            });
        }
}

function insert_info_licenciamiento(list_informacion_licenciamiento, c_placa, transaction, callback) {

    /*guardamos el registro de los operarios de corte*/
    var cantRegistros = Object.keys(list_informacion_licenciamiento).length;

    if (cantRegistros > 0) {
        async.each(list_informacion_licenciamiento, function (item, callback) {

            var request = new sql.Request(transaction);
            request.verbose = true;

            request.input("IN_C_PLACA", sql.BigInt, c_placa);
            request.input("IN_C_LICENCIA", sql.Int, item.c_licencia);
            request.input("IN_C_VERSION_LICENCIA", sql.Int, item.c_version_licencia);
            request.input("IN_CANT_REAL", sql.Int, item.cant_real);
            request.input("IN_CANT_SIN_RESOLVER", sql.Int, item.cant_sin_resolver);
            request.input("IN_ORIGINAL", sql.VarChar, item.original);
            request.input("IN_RENOVACION", sql.VarChar, item.renovacion);
            
            request.output("MSG", sql.VarChar);

                request.execute('SSP_INSERT_DT_INFORMACION_LICENCIAMIENTO', function(err, recordsets, returnValue) {
                    if (err) {
                        // ... error checks

                        callback(request.parameters.MSG.value);

                    } else if (request.parameters.MSG.value !== "OK") {
                        callback(request.parameters.MSG.value);
                    } else {
                        cantRegistros--;
                        callback();
                    }

                });
            },
            function (err) {

                if (err) {
                    return callback({
                        error: "err",
                        MSG: err
                    });

                } else {

                    if (cantRegistros === 0) {
                        return callback(null, {
                            data: []
                        });
                    }
                }
            });

    } else {
        return callback(null, {
            data: []
        });
    }
}

function insert_info_servidor_archivos(list_informacion_servidor_archivos, c_placa, transaction, callback) {

    /*guardamos el registro de los operarios de corte*/
    var cantRegistros = Object.keys(list_informacion_servidor_archivos).length;

    if (cantRegistros > 0) {
        async.each(list_informacion_servidor_archivos, function (item, callback) {

            var request = new sql.Request(transaction);
            request.verbose = true;

            request.input("IN_C_PLACA", sql.BigInt, c_placa);
            request.input("IN_CARPETA", sql.VarChar, item.carpeta);
            request.input("IN_ROL", sql.VarChar, item.rol);

            request.output("MSG", sql.VarChar);

                request.execute('SSP_INSERT_DT_INFORMACION_SERVIDOR_ARCHIVOS', function(err, recordsets, returnValue) {
                    if (err) {
                        // ... error checks

                        callback(request.parameters.MSG.value);

                    } else if (request.parameters.MSG.value !== "OK") {
                        callback(request.parameters.MSG.value);
                    } else {
                        cantRegistros--;
                        callback();
                    }

                });
            },
            function (err) {

                if (err) {
                    return callback({
                        error: "err",
                        MSG: err
                    });

                } else {

                    if (cantRegistros === 0) {
                        return callback(null, {
                            data: []
                        });
                    }
                }
            });

    } else {
        return callback(null, {
            data: []
        });
    }
}

function insert_info_mantenimientos(list_informacion_mantenimientos, c_placa, transaction, callback) {

    /*guardamos el registro de los operarios de corte*/
    var cantRegistros = Object.keys(list_informacion_mantenimientos).length;

    if (cantRegistros > 0) {
        async.each(list_informacion_mantenimientos, function (item, callback) {

            var request = new sql.Request(transaction);
            request.verbose = true;

            request.input("IN_C_PLACA", sql.BigInt, c_placa);
            request.input("IN_RESUMEN", sql.VarChar, item.resumen);
            request.input("IN_FECHA", sql.VarChar, item.fecha);
            request.input("IN_TECNICO", sql.VarChar, item.tecnico);
            request.input("IN_OBSERVACIONES", sql.VarChar, item.observaciones);
            
            request.output("MSG", sql.VarChar);

                request.execute('SSP_INSERT_DT_INFORMACION_MANTENIMIENTOS', function(err, recordsets, returnValue) {
                    if (err) {
                        // ... error checks

                        callback(request.parameters.MSG.value);

                    } else if (request.parameters.MSG.value !== "OK") {
                        callback(request.parameters.MSG.value);
                    } else {
                        cantRegistros--;
                        callback();
                    }

                });
            },
            function (err) {

                if (err) {
                    return callback({
                        error: "err",
                        MSG: err
                    });

                } else {

                    if (cantRegistros === 0) {
                        return callback(null, {
                            data: []
                        });
                    }
                }
            });

    } else {
        return callback(null, {
            data: []
        });
    }
}

module.exports = router;
