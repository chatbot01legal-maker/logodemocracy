const {VertexAI}

=

require(

"@google-cloud/vertexai"

);

let vertex=null;

function getVertex(){

if(vertex)

return vertex;

vertex=

new VertexAI({

project:

process.env

.GOOGLE_CLOUD_PROJECT,

location:

"southamerica-west1"

});

return vertex;

}

async function askVertex(

prompt,

model=

"gemini-2.5-flash"

){

const client=

getVertex();

const gm=

client

.getGenerativeModel({

model

});

const response=

await gm

.generateContent(

prompt

);

return response

.response

.candidates[0]

.content

.parts[0]

.text;

}

module.exports={

askVertex

};
