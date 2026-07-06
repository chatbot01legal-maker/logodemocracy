const express = require('express');
const router = express.Router();

const {
  getPhilosopherConsultation,
  getTutorReply
} = require('../modules/reyFilosofoService');


router.post('/chat', async (req, res) => {

  console.log('[REY-FILOSOFO-API] POST /consult recibido');

  try {

    const { text, sophiaContext } = req.body;

    const consultation =
      await getPhilosopherConsultation(
        text,
        sophiaContext
      );

    res.json({
  reply: result.advice,
  debug: result
});

  }

  catch (error) {

    console.error(error);

    res.status(400).json({

      success:false,

      error:error.message

    });

  }

});


router.post('/chat', async (req, res) => {

  console.log('[REY-FILOSOFO-API] POST /chat recibido');

  try {

    const result =
      await getTutorReply(req.body);

    res.json({

      reply:
        result.advice ||

        "No fue posible generar una respuesta."

    });

  }

  catch (error) {

    console.error(

      '[REY-FILOSOFO-API] Error en /chat:',

      error

    );

    res.status(500).json({

      error:error.message

    });

  }

});


module.exports = router;
