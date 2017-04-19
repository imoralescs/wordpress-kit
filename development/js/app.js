import {Example} from './modules/example.js';

var objects = {
	name : "Jack Mean",
	description : "Jack is a lone wolf, from cold high mountain."
};

var example = new Example(objects);

console.log(example.getName());
