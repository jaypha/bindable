# bindable

A set of classes to enable simple binding of variables for thos who don't
want to use a framework just to get bindings.

It basically works by enabling the attachment of event listeners to a value.
When the value changes, the event triggers.

Available in ES6, UMD and CJS.

## Installation

## Example

```
let bv = new BindableValue(0);
bv.addEventLisener((bv,old) => console.log("Value changed from "+old+" to "+bv.get()));

bv.set(10); // "Value changed from 0 to 10" should be logged.

let e = document.getElementById("somewidget");

// A two way binding is created. Updating one will change the other.
bv.bindWidget(e);
```

## TODO

* Docuemntation
* More test code

## License

Copyright (C) 2019 Jaypha.  
Distributed under the [Boost Software License, Version 1.0](http://www.boost.org/LICENSE_1_0.txt).

