# Include

Include is a script that allows the importing of ES6 Classes into Node.js

## Usage

Sample class.js

```javascript
export class Foo{
    constuctor(){
        this.property = ""
    }
    get gettersSetters(){
        return this.property;
    }
    set gettersSetters(value){
        this.property = value;
    }
}
```
In Node.js

```javascript
const { include } = require('include.js');
include('class.js');

const foo = new Foo();
```
The script supports the import statement from within the ES6 class, at the moment it only supports modules.

Sample anotherclass.js

```javascript
import BrowserWindow from Electron.js;

export class Bar{
    constructor(){
        this.window = new BrowserWindow();
    }
}
```

