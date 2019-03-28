//----------------------------------------------------------------------------
// Node.js script
//----------------------------------------------------------------------------
// 
//----------------------------------------------------------------------------

//import resolve from 'rollup-plugin-node-resolve';
//import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
	{
		input: 'src/bindable.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	},
	{
		input: 'src/bindable.js',
    output: {
      name: "bindable",
      format: 'iife',
      file: pkg.browser,
    }
  }
];

//----------------------------------------------------------------------------
// Copyright (C) 2019 Jaypha
// License: BSL-1.0
// Authors: Jason den Dulk
//

