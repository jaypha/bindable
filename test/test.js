//----------------------------------------------------------------------------
// Node.js
//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------

const assert = require('assert');
const bindable = require('..');

//----------------------------------------------------------------------------
// Test BindableValue

let oldValue=0;
let newValue=0;

assert.equal(oldValue,0);
assert.equal(newValue,0);

let bv = new bindable.BindableValue(12);

bv.addEventListener((o,v) => { oldValue = v; newValue = o.get(); });

bv.set(15);

assert.equal(oldValue,12);
assert.equal(newValue,15);

//----------------------------------------------------------------------------
// Test BindableObject

let bo = new bindable.BindableObject();

let additions = [];
let removals = [];

bo.addEventListener("add", (o,p) => { additions.push(p); });
bo.addEventListener("remove", (o,p) => { removals.push(p); });

bo.setItem("a", "hello");
bo.proxy.b = 1;
bo.proxy.g = 15;

assert.equal(bo.getItem("b"),1);
assert.equal(bo.proxy.a,"hello");

bo.proxy.g = 12;

bo.removeItem("b");

assert.deepEqual(additions,["a","b","g"]);
assert.deepEqual(removals,["b"]);

//----------------------------------------------------------------------------
// Copyright (C) 2019 Jaypha
// License: BSL-1.0
// Authors: Jason den Dulk
//

