contextualizer
==============


Try `node bar_test.js`. The basic premise is:

```
bar = require('./bar')
bar.createContext( momentObj, function(context){
	// Do something with the new context
})
```