var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
oracledb.autoCommit = true;

router.get('/', async function (request, response) {

    let connection;
    try {

        connection = await oracledb.getConnection({
            user: "Ludica_admi",
            password: "12345",
            connectionString: "localhost/xe"
        });
        const data = await connection.execute(
            'SELECT * FROM usuarios ORDER BY id_us',
            [],
            { keepInStmtCache: false }
        );

        console.log(data.rows)

        let lista = [];

        for (let i = 0; i < data.rows.length; i++) {
            let usuarios = {
                id_us: data.rows[i][0],
                correo_us: data.rows[i][1],
                nombre_us: data.rows[i][2],
                primer_apellido_us: data.rows[i][3],
                segundo_apellido_us: data.rows[i][4],
                celular_us: data.rows[i][5],
                contrasenna_us: data.rows[i][6],
                rol_us: data.rows[i][7]
                
            }
            lista.push(usuarios);
        }

        response.send({ exito: true, lista: lista });

    } catch (err) {
        console.error(err);
        
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

router.post('/crear', async function(request, response) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "Ludica_admi",
      password: "12345",
      connectionString: "localhost/xe",
      stmtCacheSize: 0,
    });

    // Validar que el valor de 'rol_us' sea 'profesor' o 'estudiante'
    const rol = request.body.rol_us;
    if (rol !== 'profesor' && rol !== 'estudiante') {
      response.status(400).send({ exito: false, mensaje: "El valor de 'rol_us' no es válido. Debe ser 'profesor' o 'estudiante'." })
      ;
      return;
    }

    const insercion = await connection.execute(
      "INSERT INTO usuarios VALUES (seq_usuario.nextval, '" + request.body.correo_us + "', '" + request.body.nombre_us + "', '" + request.body.primer_apellido_us + "', '" + request.body.segundo_apellido_us + "', '" + request.body.celular_us + "',  '" + request.body.contrasenna_us + "', '"+ request.body.rol_us + "')"
    );

    response.send({ exito: true });

  } catch (err) {
    console.error(err);
    response.status(500).send({ exito: false, mensaje: "Error al crear el usuario" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
})

router.put('/:id/', async function (request, response) {
  let connection;
  try {
    const id_us = request.params.id;
    const correo_us = request.body.correo_us;
    const nombre_us = request.body.nombre_us;
    const primer_apellido_us = request.body.primer_apellido_us;
    const segundo_apellido_us = request.body.segundo_apellido_us;
    const celular_us = request.body.celular_us;
    const contrasenna_us = request.body.contrasenna_us;
    const rol_us = request.body.rol_us;

    connection = await oracledb.getConnection({
      user: "Ludica_admi",
      password: "12345",
      connectionString: "localhost/xe"
    });
    const result = await connection.execute(
      'UPDATE usuarios SET nombre_us = :nombre, correo_us = :correo, primer_apellido_us = :primer_apellido, segundo_apellido_us = :segundo_apellido, celular_us = :celular, contrasenna_us = :contraseña, rol = :rol WHERE id_us = :id',
      { 
        id: id_us,
        correo: correo_us,
        nombre: nombre_us,
        primer_apellido: primer_apellido_us,
        segundo_apellido: segundo_apellido_us,
        celular: celular_us,
        contraseña: contrasenna_us,
        rol: rol_us
      }
    );

    response.send({ exito: true });

  } catch (err) {
    console.error(err);
    response.status(500).send({ exito: false, mensaje: "Error al actualizar usuario" })
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});


router.delete('/:id', async function (request, response) {
  let connection;
  try {
      connection = await oracledb.getConnection({
          user: "Ludica_admi",
          password: "12345",
          connectionString: "localhost/xe"
      });

      const id_us = request.params.id;

      const result = await connection.execute(
          `DELETE FROM usuarios WHERE id_us = :id`, [id_us]
      );

      response.send({ exito: true, mensaje: "Usuario eliminado correctamente" });

  } catch (err) {
      console.error(err);
      response.status(500).send({ exito: false, mensaje: "Error al eliminar usuario" });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error(err);
          }
      }
  }
});


router.post('/login', async function (request, response) {
  let connection;
  try {
      connection = await oracledb.getConnection({
          user: "Ludica_admi",
          password: "12345",
          connectionString: "localhost/xe"
      });

      const correo_us = request.body.correo_us;
      const contrasenna_us = request.body.contrasenna_us;

      const result = await connection.execute(
          `SELECT * FROM usuarios WHERE correo_us = :correo AND contrasenna_us = :contraseña`, [correo_us, contrasenna_us] 
      );

      if (result.rows) {
        response.send({ exito: true, mensaje: "El usuario ha sido encontrado" });
      } else {
        response.status(500).send({ exito: false, mensaje: "Error al buscar el usuario" });
      }

     

  } catch (err) {
      console.error(err);
      response.status(500).send({ exito: false, mensaje: "Error conectando en la base de datos" });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (err) {
              console.error(err);
          }
      }
  }
});

module.exports = router;