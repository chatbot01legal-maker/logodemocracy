module.exports = {

 async record(lm, metadata, analogy, score){

   if(!lm) return;

   if(!lm.telemetry){
      lm.telemetry = {};
   }

   if(!lm.telemetry.successful_analogies){
      lm.telemetry.successful_analogies = [];
   }

   if(analogy){

      lm.telemetry.successful_analogies.push({

         concept: metadata?.concept,

         analogy: analogy.analogy,

         effectiveness: score

      });

   }

 }

};
