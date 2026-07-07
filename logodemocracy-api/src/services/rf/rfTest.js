const RFKernel = require('./RFKernel');

async function run(){

   const result = await RFKernel.process({

      userId:"demo",

      sessionId:"session1",

      provider_module:"Sophia",

      content:"La democracia deliberativa requiere intercambio argumentativo.",

      user_response:"No entiendo",

      metadata:{
         concept:"democracia",
         competencies:["critical_reading"]
      }

   });

   console.log(result);

}

run();
