# clay-view

## What is Clay

## Installation
```
yarn add clay-view
npm install clay-view
```

## Basic Usage

To use Clay you simply import the `<clay-view>` component and bind your `Schema` with `v-model`.

```vue
<template>
    <clay-view v-model="schema"/>
</template>

<script>
import {ClayView} from 'clay-view';
export default {
        components: {ClayView},
        data(){
            return {
                schema: {
                    namespace: 'someUniqueNamespace',
                    component: 'div'
                }, 
            }           
    }
}
</script>
``` 
This will render be rendered as :
```html
<div></div>
```

## The CNode structure

### Namespace
The `namespace` is a required unique key that must be present in every CNode. It is later used to get and identify the data of this CNode
```ts
{
  namespace: string 
}
```

### Component
The `component` is a required key that tells the CNode witch `HtmlTag` or `VueComponent` it is representing. 
For a simple `HtmlTag` simply put the tag name in.

```js
// Will render an <div>
const DivCNode={
  namespace: 'key',
  component: 'div',
}
// Will render an <button>
const ButtonCNode={
  namespace: 'key',
  component: 'button',
}
```

To use an Vue Component you have four different choices.
The first one is you simply use a global registered `VueComponent`. In this case you put the component tag in the key.
 
```js
Vue.component('my-global-component', {/* ... */});
// Will render the registered <my-global-component> Vue Component
const GlobalComponentCNode={
  namespace: 'key',
  component: 'my-global-component',
}
```

The second one is you tell the `<clay-view>` which `VueComponents` it should locally register.To do so add an object with all the `VueComponents` to the `components` prop at the `<clay-view>`.
Now you can simply use the component tag name as you would with a global Component.
 
```vue
<template>
    <clay-view v-model="schema" :components="components"/>
</template>

<script>
import {ClayView} from 'clay-view';
import MyLocalComponent from 'MyLocalComponent.vue';
export default {
    components: {ClayView},
    data(){
        return {
            schema: {
                namespace: 'someUniqueKey',
                component: 'MyLocalComponent'
            },   
            components: {MyLocalComponent}
        }           
    }
}
</script>
``` 

The third option is to use put your imported component directly into the CNode.
````js
import MyLocalComponent from 'MyLocalComponent.vue';
// Will render MyLocalComponent Vue Component
const GlobalComponentCNode = {
  namespace: 'key',
  component: MyLocalComponent,
}
````

The last option is to use `inlineComponents`. You can simply define your component inside the `CNode` with an template.
> For this to work you need an build of vue which includes the runtime compiler

````js
// Will render <div>My inline component</div> Vue Component
const GlobalComponentCNode = {
  namespace: 'key',
  component: {
    template: '<div>My inline component</div>'
    /* all the other vue Component Stuff */
  },
}
````

### Children
The `children` lets you define which children an `CNode has. It accepts ether an array or a single `CNode`.
If your `CNode` is representing an `component` with `slots` you can put them here as well with the `slot` key for named Slots. 
````js
// Will render <div><span></span></div>
const ChildrenCNode = {
  namespace: 'key',
  component: 'div',
  children: {
    namespace: 'childKey',
    component: 'span'
  }
}
`````

### text (v-text)
The `text` key is basically the `v-text` directive from vue.
>If the `CNode` has a `text` and `children` key at the same time the `text` will overwrite the `children`
```js
// Will render <div>Some Text</div>
const TextCNode = {
  namespace: 'key',
  component: 'div',
  text: 'Some Text'
}
```

### if (v-if)
The `if` key is basically the `v-if` directive from vue.
```js
// Will render nothing
const TextCNode = {
  namespace: 'key',
  component: 'div',
  if: false
}
```

### show (v-show)
The `show` key is basically the `v-show` directive from vue.
```js
// Will render <div style="display:none;"></div>
const TextCNode = {
  namespace: 'key',
  component: 'div',
  show: false
}
```

### For (v-for)
The `for` key is basically the `v-for` directive from vue. To use it put an array or object in this key. The CNode will than
get looped for every item inside the array or object. You can access the value by [binding](#binding) it to `<loopNamsepac>/for::value`
the current index by `<loopNamsepac>/for::index` and if you loop an object the current key by `<loopNamsepac>/for::key` 
> Note that as with the normal v-for you should specify a key and you can not loop the root element
```js
// Will render <div><span data-index="0">item_1</span><span data-index="1">item_2</span></div>
const loopableCNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'looping-child',
        component: 'span',
        for: { key1: 'item_1', key2: 'item_2' },
        ':key': 'looping-child/for::key',
        attrs: {
          ':data-index': 'looping-child/for::index',
        },
        ':text': 'child/for::value',
      },
    };
```

### class 
The `class` key let you add css classes to an CNode. It follows the same syntax as a [normal bound class in vue](https://vuejs.org/v2/guide/class-and-style.html#Binding-HTML-Classes). So you can use
an `string`, `array` or`object` to define your classes
```js
// Will render <div class="someClass"></div>
const ClassStringCNode = {
  namespace: 'key',
  component: 'div',
  class: 'someClass'
}

// Will render <div class="someClass someMoreClass"></div>
const ClassArrayCNode = {
  namespace: 'key',
  component: 'div',
  class: ['someClass','someMoreClass']
}

// Will render <div class="someClass"></div>
const ClassObjectCNode = {
  namespace: 'key',
  component: 'div',
  class: {
    'someClass': true,
    'notPresentClass': false,
  }
}
```

## Style
The `style` key lets you add inline Styles with the [Object Syntax](https://vuejs.org/v2/guide/class-and-style.html#Object-Syntax-1) from vue.
```js
// Will render <div style="color:red"></div>
const StyledCNode = {
  namespace: 'key',
  component: 'div',
  style: {
    color: 'red'
  }
}
```

### Attrs
The `attrs` key lets you add normal Html attributes as object
```js
// Will render <div id="foo"></div>
const StyledCNode = {
  namespace: 'key',
  component: 'div',
  attrs: {
    id: 'foo'
  }
}
```

### Props
The `props` key lets you add props to components
```vue
<!--PropComponent.vue-->
<template>
    <div v-text="myProp" />
</template>
<script>
    export default {
        props: ['myProp']
    }
</script>
```
```js
import PropComponent from './PropComponent.vue'
// Will render <div>foo</div>
const StyledCNode = {
  namespace: 'key',
  component: PropComponent,
  props: {
    myProp: 'foo'
  }
}
```

### DomProps
The `domProps` key lets you add `DOM Properties` to the `CNode`.
```js
// Will render <input value="foo" />
const DomPropsCNode = {
  namespace: 'key',
  component: 'input',
  domProps: {
    value: 'foo'
  }
}
```

### Slot
The `slot` key lets you define a Slot name like `v-slot`.
```js
const SlotCNode = {
  namespace: 'key',
  component: 'div',
  slot: 'slotName'
}
```

### Key
The `key` key lets you define a key for a CNode. Important for `v-for` loops.
```js
const SlotCNode = {
  namespace: 'key',
  component: 'div',
  key: 'someKey'
}
```

### Ref
The `ref` key is the same as the vue [ref](https://vuejs.org/v2/api/#ref).
```js
const SlotCNode = {
  namespace: 'key',
  component: 'div',
  ref: 'someRef'
}
```

### RefInFor
If you are applying the same ref name to multiple elements in the CNode. This will make `$refs.myRef` become an array
```js
const SlotCNode = {
  namespace: 'key',
  component: 'div',
  refInFor: false
}
```

### On
With the `on` key you can specify event handlers. They work the same as [here](https://vuejs.org/v2/guide/render-function.html#Event-amp-Key-Modifiers) explained
```js
const EventCNode = {
  namespace: 'key',
  component: 'button',
  on: {
    click: () => console.log('Hurray')
  }
}
```

### NativeOn
Same as the `on` only for Native Events [more](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)
```js
const EventCNode = {
  namespace: 'key',
  component: 'button',
  nativeOn: {
    click: () => console.log('Hurray')
  }
}
```

## Binding
So because Clay is meant to be used outside auf JavaScript as well it comes with its own Binding system that don't relay 
on JavaScript functions, Objects or variables. Each `CNode` can have its own `data` ,similar to the `data` key in a Vue Component,
that is reactive and can be used inside of the `CNode`.
To register the `data` you add a `data` key to your `CNode`.
```js
const DataCNode = {
  namespace: 'key',
  component: 'div',
  data: {
    myReactiveData: 'SomeData'
  }
}
```
Now you can bind this data to our other keys. For example the `text`:
```js
const DataCNode = {
  namespace: 'ownNamespace',
  component: 'div',
  ':text': 'ownNamespace::myReactiveData',
  data: {
    myReactiveData: 'SomeData'
  }
}
```
As you can see we tell clay, by prefixing the key with a `:`, that we want to bind this key to an different value.
Then we specify the key of the value inside of our `data` and prefix it with our `namespace` separated by `::`. The Rendered output will now be: 
````html
<div>SomeData</div>
````
If we want to get values from an more nested object we can use dot notation to get them:
```js
const DataCNode = {
  namespace: 'ownNamespace',
  component: 'div',
  ':text': 'ownNamespace::myReactiveData.nested.inside',
  data: {
    myReactiveData: {
      nested: {
        inside: 'Foo'
      }
    }
  }
}
```
```html
<div>Foo</div>
```
Because of the namespace we can also access data from a parent inside of an child:
```js
const DataCNode = {
  namespace: 'parentNamespace',
  component: 'div',
  data: {
    myReactiveData: 'Foo'
  },  
  children: {
    namespace: 'childNamespace',
      component: 'span',
      ':text': 'parentNamespace::myReactiveData',
  } 
}
```
```html
<div><span>Foo</span></div>
```
> You can not use the child data inside of the parent!

You cant bind all of the Keys of an CNode but here is an list of all the keys that allow binding:
```js
const DataCNode = {
  namespace: 'namespace',
  component: 'div',
  ':text': 'namespace::myReactiveData',
  ':class': 'namespace::myReactiveData',
  ':if': 'namespace::myReactiveData',
  ':show': 'namespace::myReactiveData',
  ':key': 'namespace::myReactiveData',
  ':for': 'namespace::myReactiveData',
  'attrs': {
    ':id' : 'namespace::myReactiveData'
  },
  'style': {
    ':color' : 'namespace::myReactiveData'
  },
  'props': {
    ':myProp' : 'namespace::myReactiveData'
  },
  'domProps': {
    ':myDomProp' : 'namespace::myReactiveData'
  },
  'on': {
    ':click': 'namespace::myReactiveFunction'
  },
  'nativeOn': {
    ':click': 'namespace::myReactiveFunction'
  },
  data: {
    myReactiveData: 'data',
    myReactiveFunction: () => {}
  }
}
```

## Scoped Slots
Clay allows you to use Scoped Slots which enables you to control and use pretty much everything from, for example your backend.
If you don't know what Scoped Slots are read [this](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) 
So how does it work:
First an normal Vue Example that we then translate to Clay.

```vue
<template>
    <scoped-slot-compoent>
        <template v-slot="props">
            <button @click="props.scopedFunction">{{props.scopedValue}}</button>
        </template>
    </scoped-slot-compoent>
</template>

<script>
import ScopedSlotComponent from 'ScopedSlotComponent.vue';
    export default {
        components: {ScopedSlotComponent}
    }
</script>
```

As you can see we are using a `ScopedSlotComponent` that provides us with an function an a value. We than use it to bind
the function to an click event on a button and the value as an label. 
Translated in a CNode it would look like this:

```js
import ScopedSlotComponent from 'ScopedSlotComponent.vue';

const scopedSlotCNode = {
  namespace: 'key',
  component: ScopedSlotComponent,
  scopedSlots: {
    default: {
      key: 'props',
      content: { /** **/ }
    }
  }
}
```

First we concentrate on this syntax. To specify that a CNode has an Scoped Slot we use the `scopedSlots` key.
This key except an Object of `ClayScopedSlot` objects. The key of each `ClayScopedSlot` object is the name of the Slot.
So in this case because we didn't specify any name we use the `default`.
The `key` inside of the `ClayScopedSlot` is our unique identifier to get the data from our scoped slot. You will see how this 
work in a minute.
The `content` key inside of the `ClayScopedSlot` except an `CNode` again. This CNode has now access to the ScopedSlot data.
In action it looks like this.

```js
import ScopedSlotComponent from 'ScopedSlotComponent.vue';

const scopedSlotCNode = {
  namespace: 'slotNamespace',
  component: ScopedSlotComponent,
  scopedSlots: {
    default: {  
      namespace: 'child',
      component: 'button',
      ':text':'slotNamespace/slot/default::scopedValue',
      onNative: {
        ':click': 'slotNamespace/slot/default::scopedFunction'
      } 
    }
  }
}
```
As you can see we tell clay to bind the `text` and the `click` to an value. But because we want to use the `data` from our scoped slot 
we prefix it with the `namespace` from the `CNode` with the `scopedSlot` and add the `/slot/` and the name of the slot ,in this case `default`.
Now we can use out dot notation to get the data from the `scopedSlot`.  

We can even nest scoped slots deeply and every Child will have access to all of his parent Scoped Slots.
```js
import ScopedSlotComponent from 'ScopedSlotComponent.vue';
import OtherScopedSlotComponent from 'OtherScopedSlotComponent.vue';

const scopedSlotCNode = {
  namespace: 'rootSlot',
  component: ScopedSlotComponent,
  scopedSlots: {
    default: {
      namespace: 'childSlot',
      component: OtherScopedSlotComponent,
      ':class': 'rootSlot/slot/default::scopedValue',
      scopedSlots: {
        default: {
          namespace: 'nestedChild',
          component: 'button',
          ':text': 'childSlot/slot/default::scopedValue',
          onNative: {
            ':click': 'rootSlot/slot/default::scopedFunction'
          }
        }
      }
    }
  }
};
```
