(function(){

'use strict';


function assert(condition,message){

    if(!condition)
        throw new Error(message);

}



TestRunner.test(
"Rey Filósofo puede acceder al CognitiveRuntime",
function(){

    assert(
        typeof CognitiveRuntime !== "undefined",
        "CognitiveRuntime debe existir"
    );

});



TestRunner.test(
"Rey Filósofo obtiene contexto cognitivo",
function(){

    var context =
    CognitiveRuntime.getUserContext();


    assert(
        context !== null,
        "Debe existir contexto"
    );


    assert(
        typeof context.strategy === "object",
        "Debe existir estrategia"
    );


});



})();
