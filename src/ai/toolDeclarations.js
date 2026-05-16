export const toolDeclarations = [

   {
      name:'createFile',

      description:'Create a new file',

      parameters:{
         type:'OBJECT',
         properties:{
            path:{
               type:'STRING'
            }
         },
         required:['path']
      }
   },

   {
      name:'writeFile',

      description:'Write code into file',

      parameters:{
         type:'OBJECT',
         properties:{
            path:{
               type:'STRING'
            },

            content:{
               type:'STRING'
            }
         },

         required:[
            'path',
            'content'
         ]
      }
   },

   {
      name:'readFile',

      description:'Read file content',

      parameters:{
         type:'OBJECT',
         properties:{
            path:{
               type:'STRING'
            }
         },

         required:['path']
      }
   }

]