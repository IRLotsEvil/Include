# Include

Include is a script that allows the importing of ES6 Classes into Node.js, I made this module for convenience and make it easier to break up classes

## Usage

Sample *class.js*

```javascript
export class Foo{
    constuctor(){
        this.property = ""
    }
    aFunction(){
        return this.property;
    }
    static aStaticFunction(value){
        console.log(value);
    }
}
```
In Node.js

```javascript
const { include } = require('include');
include('class.js');

const foo = new Foo();
```
The script supports the import statement from within the ES6 class

Sample *anotherclass.js*

```javascript
import { BrowserWindow } from "electron";

import { Foo } from "./class";

export class Bar{
    constructor(){
        this.window = new BrowserWindow();
        this.foo = new Foo();
    }
}
```

