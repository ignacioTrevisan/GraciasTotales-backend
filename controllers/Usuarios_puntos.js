const Puntos = require("../models/Puntos");
const Puntos_Usuarios = require("../models/Puntos_Usuarios");

const cargarPuntos = async (req, res = response, next) => {

    const puntos = await Puntos.findOne({ cantidad: req.body.cantidad, codigo: req.body.codigo });
    if (!puntos && req.body.tipo === 'suma') {
        return res.status(404).json({
            ok: false,
            msg: 'Datos incorrectos, asegurese de haber ingresado correctamente el codigo. '
        })
    }


    try {

        const usuario = await Puntos_Usuarios.findOne({ uid: req.body.uid });

        let NuevoUsuario = {};
        if (!usuario) {
            if (req.body.tipo !== 'resta') {

                NuevoUsuario = new Puntos_Usuarios(req.body)
                await NuevoUsuario.save();
                await Puntos.findOneAndDelete({ cantidad: req.body.cantidad, codigo: req.body.codigo });

                return res.status(200).json({
                    ok: true,
                    msg: `El usuario no tenia puntos, se le asignaron: ${req.body.cantidad} `,
                    cantidad: req.body.cantidad
                })

            } else {
                return res.status(404).json({
                    ok: false,
                    msg: `El usuario no existe `
                })
            }
        } else {

            let nuevaCantidad;
            if (req.body.tipo === 'suma') {
                nuevaCantidad = parseInt(usuario.cantidad) + parseInt(req.body.cantidad);
            } else {
                if (isNaN(Number(usuario.cantidad)) || isNaN(Number(req.body.cantidad))) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Cantidad inválida',
                    });
                }
                if (Number(usuario.cantidad) < Number(req.body.cantidad)) {
                    return res.status(406).json({
                        ok: false,
                        msg: 'Puntos insuficientes',
                        tenes: usuario.cantidad,
                        cuesta: req.body.cantidad,
                    });
                }
                nuevaCantidad = parseInt(usuario.cantidad) - parseInt(req.body.cantidad);

            }
            const usuarioConPuntos = {
                ...usuario, cantidad: nuevaCantidad
            }

            const usuarioActualizado = await Puntos_Usuarios.findByIdAndUpdate(
                usuario._id,
                { cantidad: nuevaCantidad },
                { new: true }
            );

            res.json({
                ok: true,
                usuario: usuarioActualizado,
                cantidad: nuevaCantidad
            });
            await Puntos.findOneAndDelete({ cantidad: req.body.cantidad, codigo: req.body.codigo });


        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const obtenerPuntos = async (req, res = response, next) => {
    const uid = req.body.uid
    try {

        const usuario = await Puntos_Usuarios.findOne({ uid });
        if (!usuario) {
            return res.status(200).json({
                cantidad: 0,
                ok: true,
                body: req.body,
                uid: req.body.uid,
                msg: `No se encontro usuario ${req.body.uid}`
            })

        } else {
            return res.status(200).json({
                cantidad: usuario.cantidad,
                ok: true,
            })
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: error
        });
    }
}


const reclamarPuntos = async () => {



    if (puntos) {
        return res.status(200).json({
            ok: true,
            msg: 'borrar Evento'
        })
    } else {
        return res.status(404).json({
            ok: false,
            msg: 'No se encontraron estos puntos'
        })
    }


}
module.exports = {
    cargarPuntos,
    obtenerPuntos
}