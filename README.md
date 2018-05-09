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

Then provide a configuration object to the `constructor` containing your [mongoose](https://github.com/Automattic/mongoose) models (this example use ES6 shorthand object property notation) :
```
// Example models configuration

import Bloomberg from 'path/to/models/bloomberg'
import Stoxx from 'path/to/models/stoxx'
import Bats from 'path/to/models/bats'

const candle = new Candle({ Blommberg, Stoxx, Bats })
```

## Useage

The only function we need ATM is `databaseInsert`, but it only accept CSV... more on this tomorrow


## Behaviors


## Dependencies

* [bluebird](https://github.com/petkaantonov/bluebird) - A full featured promise library with unmatched performance

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
