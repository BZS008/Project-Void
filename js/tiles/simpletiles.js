// Tileset
//
// name: string
// solid: 0 no collision, 1 solid, 2 liquid
// color: string

var tileset=[
	{name:'air',solid:0,color:'#6677FF',draw:function(){}},	// 0
	{name:'rock',solid:1,color:'#442222',draw:basictiledraw},	// 1
	{name:'earth',solid:1,color:'#552211',draw:basictiledraw},	// 2
	{name:'sand',solid:1,color:'#DD7722',draw:basictiledraw},	// 3
	{name:'water',solid:2,color:'#2222FF',draw:liquid.drawtile}	// 4
]
