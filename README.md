# AdOn Candle

A simple file to database parser from CSV - JSON - XML - YAML

## Installing

Using npm :

```
npm install adon-candle
```

Using yarn :

```
yarn add adon-candle
```

## Setup

Import ES6 module style :

```
import Candle from 'adon-candle'
```

Or CommonJS style :

```
const Candle = require('adon-candle')
```

Then provide a configuration object to the class `constructor` containing your [mongoose](https://github.com/Automattic/mongoose) models (this example use ES6 shorthand object property notation and imports) :

```
// Example models configuration

import MyModel from 'path/to/models/my-model'
import MyOtherModel from 'path/to/models/my-other-model'

const candle = new Candle({ MyModel, MyOtherModel })
```

## Useage

Assuming you already got a mongoose instance connected to MongoDB and your file uploaded somewhere in your application scope, you should first create a database document to reference all lines for further queries :

```
// Example Database model, using ES6 Import

import mongoose from 'mongoose'

const { Schema } = mongoose
  , { ObjectId } = Schema.Types
  , databaseSchema = new Schema({
    _id: { type: ObjectId, required: true }
    , date: { type: Date, default: Date.now }
    , type: { type: String, required: true }
})

export default mongoose.model('Database', databaseSchema)
```

* Have a look at [ECMAScript Modules](https://nodejs.org/api/esm.html) to enable ES6 `import` without transpiling with [Babel](https://babeljs.io/docs/usage/cli/) to CommonJS `require`

```
// Example database creation
import mongoose from 'mongoose'
import Database from 'path/to/models/Database'

const { ObjectId } = mongoose.Types

new Database({ _id: ObjectId(), type: 'MyModel' }).save(err => // Treat errors) 
```

Then provide a single object to the `fileToDatabase` function with the following properties :

```
candle.fileToDatabase({
  file: // The path to your file
  , type: // The type of database model to use (from those provided to the class constructor)
  , database: // A valid mongoose ObjectId for reference, default to null
  , delimiter: // The CSV delimiter, default to ';'
  , date: // Overwrite the 'date' data field with Date.now() if set to true
  , safe: // Reject the promise if set to true and a line contains errors
})
```

If set, the property `database` will be added to each line before matching with your model and must be defined as a reference to your `Database` model :

```
import mongoose from 'mongoose'
import Database from 'path/to/models/Database'

const { Schema } = mongoose
  , { ObjectId } = Schema.Types
  , mySchema = new Schema({
    datebase: { type: ObjectId, ref: 'Database' }
    // Other data fields
})

export default mongoose.model('MyModel', mySchema)
```

## Behaviors

The file format will be automatically detected by its extension (CSV - JSON - XML - YAML and maybe XLS)

A cleaning operation removing all saved lines in case the `safe` property is set to true and a line does not match its model will be added

The reverse operation `databaseToFile` will be added

## Dependencies

* [bluebird](https://github.com/petkaantonov/bluebird) - A full featured promise library with unmatched performance
* [csvtojson](https://www.npmjs.com/package/csvtojson) - CSV parser to convert CSV to JSON or column arrays

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
