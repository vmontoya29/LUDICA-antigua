var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
oracledb.autoCommit = true;

router.get('/', async function (request, response) {

    let connection;
    try {

        connection = await oracledb.getConnection({
            user: "us_ppi",
            password: "12345",
            connectionString: "localhost/xe"
        });
        const data = await connection.execute(
            'SELECT * FROM mascotas',
            [],
            { keepInStmtCache: false }
        );

        console.log(data.rows)

        let lista = [];

        for (let i = 0; i < data.rows.length; i++) {
            let mascotas = {
                id_mas: data.rows[i][0],
                nombre_mas: data.rows[i][1],
                edad_mas: data.rows[i][2],
                raza_mas: data.rows[i][3],
                codigo_sexo: data.rows[i][4]
            }
            lista.push(mascotas);
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
        user: "us_ppi",
        password: "12345",
        connectionString: "localhost/xe",
        stmtCacheSize: 0,
      });

      const insercion = await connection.execute(
        "INSERT INTO mascotas VALUES (seq_mascota.nextval, '" + request.body.nombre_mas + "', " + request.body.edad_mas + ", '" + request.body.raza_mas + "', '" + request.body.codigo_sexo + "')"
      );

      response.send({ exito: true });
  
    } catch (err) {
      console.error(err);
      response.status(500).send({ exito: false, mensaje: "Error al crear la mascota" });
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
    const id_mas = request.params.id;
    const nombre_mas = request.body.nombre_mas;
    const edad_mas = request.body.edad_mas;
    const raza_mas = request.body.raza_mas;
    const codigo_sexo = request.body.codigo_sexo;

    connection = await oracledb.getConnection({
      user: "us_ppi",
      password: "12345",
      connectionString: "localhost/xe"
    });
    const result = await connection.execute(
      'UPDATE mascotas SET nombre_mas = :nombre, edad_mas = :edad, raza_mas = :raza, codigo_sexo = :sexo WHERE id_mas = :id',
      { 
        id: id_mas,
        nombre: nombre_mas,
        edad: edad_mas,
        raza: raza_mas,
        sexo: codigo_sexo
      }
    );

    response.send({ exito: true });

  } catch (err) {
    console.error(err);
    response.status(500).send({ exito: false, mensaje: "Error al actualizar mascota" })
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
          user: "us_ppi",
          password: "12345",
          connectionString: "localhost/xe"
      });

      const id_mas = request.params.id;

      const result = await connection.execute(
          `DELETE FROM mascotas WHERE id_mas = :id`, [id_mas]
      );

      response.send({ exito: true, mensaje: "Mascota eliminada correctamente" });

  } catch (err) {
      console.error(err);
      response.status(500).send({ exito: false, mensaje: "Error al eliminar mascota" });
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