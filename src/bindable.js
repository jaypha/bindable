// Client side javascript
//----------------------------------------------------------------------------
// Binding without the bloat
//----------------------------------------------------------------------------

// Binding works by allowing event handlers to be attached to a value in
// question. When the value changes, the event is fired.


//----------------------------------------------------------------------------
// BindableValue is an object encapsulating a single value. You need to use
// get and set as simply assigning will replace the object. Attach listeners
// using addEventListener. Every time set is called, the event fires.

export class BindableValue
{
  get() { return this._value; }

  set(v) {
    if (v !== this._value)
    {
      let prev = this._value;
      this._value = v;
      for (let i=0; i<this._listeners.length; ++i)
        (this._listeners[i])(this, prev);
    }
  }

  // Each listener needs to accept a BindableValue as its first parameter.
  addEventListener(fn) {
    this._listeners.push(fn);
  }

  dispatchEvent() { return this.trigger(); }

  trigger() {
    for (let i=0; i<this._listeners.length; ++i)
      (this._listeners[i])(this);
    return true;
  }

  bindWidget(w) {
    this.addEventListener(((bindable) => w.value=bindable.get()) );
    w.addEventListener('change', (ev) => this.set(w.value));
  }

  constructor(initVal) {
    this._listeners = [];
    this._value = initVal;
  }
}

//----------------------------------------------------------------------------
// A BindableObject is an object that listens for when a property is
// added or removed. You need to use removeItem(), not delete. To have the
// individual properties bindable, use BindableValue. There are two types of
// event: 'add' and 'remove'.

export class BindableObject
{
  constructor(initVal)
  {
    this._listeners =  { add:[], remove:[] };
    if (typeof(initVal) != "undefined")
      this._props = initVal;
    else
      this._props = {};
    this.proxy = new Proxy(
      this,
      {
        set: function(target,p,v) { return target.setItem(p,v); },
        get: function(target,p)  { return target.getItem(p);   }
      });
  }

  getItem(p) { return this._props[p]; }
  setItem(p,v)
  {
    let triggerEvent = false;
    if (typeof(this._props[p]) == "undefined")
      triggerEvent = true;
    this._props[p] = v;
    if (triggerEvent)
      for (let i=0; i<this._listeners.add.length; ++i)
        (this._listeners.add[i])(this,p);
    return true;
  }

  removeItem(p)
  {
    delete this._props[p];
      for (let i=0; i<this._listeners.remove.length; ++i)
        (this._listeners.remove[i])(this,p);
  }

  keys() { return Object.keys(this._props); }

  // Each listener needs to accept a BindableObject as its first parameter.
  addEventListener(type, fn)
  {
    this._listeners[type].push(fn);
  }
}

//----------------------------------------------------------------------------
// BindableArray is similar to BindableObject, but for arrays. Adding,
// removing and rearranging the elements will trigger the 'add', 'remove' and
// 'rearrange' events respectively.



export class BindableArray extends Array
{
  constructor() {
    super(...arguments);
    this._listeners = { add:[], remove:[], rearrange: [], change: [] };
  }

  // Each listener needs to accept a BindableArray as its first parameter.
  addEventListener(type, fn) { this._listeners[type].push(fn); }
  fill() {
    let result = super.fill(...arguments);
    this.triggerEvent("change");
    return result;
  }
  reverse() {
    let result = super.reverse();
    this.triggerEvent("rearrange");
    this.triggerEvent("change");
    return result;
  }
  sort(fn) {
    let result = super.sort(fn);
    this.triggerEvent("rearrange");
    this.triggerEvent("change");
    return result;
  }
  pop() {
    let result = super.pop();
    this.triggerEvent("remove");
    this.triggerEvent("change");
    return result;
  }
  shift() {
    let result = super.shift();
    this.triggerEvent("shift");
    this.triggerEvent("change");
    return result;
  }
  push() {
    let result = super.push(...arguments);
    this.triggerEvent("add");
    this.triggerEvent("change");
    return result;
  }
  unshift() {
    let result = super.unshift(...arguments);
    this.triggerEvent("add");
    this.triggerEvent("change");
    return result;
  }
  splice() {
    let len = this.length;
    let result = super.splice(...arguments);
    if (result.length > 0)
      this.triggerEvent("remove");
    if (len - result.length < this.length)
      this.triggerEvent("add");
    this.triggerEvent("change");
    return result;
  }

  triggerEvent(type)
  {
    for (let i=0; i<this._listeners[type].length; ++i)
     (this._listeners[type][i])(this);
  }
}

//----------------------------------------------------------------------------
// A BindableAssoc is an object where all the properties are
// BindableValues. It does not fire an event when you add and remove a
// property, but you can use addEventListener to add an event to a particular
// property.


export class BindableAssoc
{
  constructor(initVal)
  {
    this._props = {};
    if (typeof(initVal) != "undefined")
      for (let i in initVal)
        this._props[i] = new BindableValue(initVal[i]);
    this.proxy = new Proxy(
      this,
      {
        set: function(target,p,v) { return target.setItem(p,v); },
        get: function(target,p)  { return target.getItem(p);   }
      });
  }

  getItem(p) { if (typeof(this._props[p]) != "undefined") return this._props[p].get(); }
  setItem(p,v)
  {
    if (typeof(this._props[p]) == "undefined")
      this._props[p] = new BindableValue(val);
    else
      this._props[p].set(v);
    return true;
  }
  keys() { return Object.keys(this._props); }
  removeItem(p) { delete target._props[p]; }

  // Each listener needs to accept a BindableValue as its first parameter.
  addEventListener(p, fn)
  {
    if (typeof(this._props[p]) == "undefined")
      this._props[p] = new BindableValue();
    this._props[p].addEventListener(fn);
  }

  bindWidget(p, wgt)
  {
    if (typeof(this._props[p]) == "undefined")
      this._props[p] = new BindableValue();
    this._props[p].bindWidget(wgt);
  }
}


//----------------------------------------------------------------------------
// A convenience function that updates the innards of an element in response
// to a change.

export function setInnerHtml(r,sel) {
  return function(v) {
    let l = r.querySelectorAll(sel);
    for (let i=0; i<l.length; ++i)
      l[i].innerHTML = v;
  }
};

//----------------------------------------------------------------------------
// Copyright (C) 2019 Jaypha
// License: BSL-1.0
// Authors: Jason den Dulk
//

