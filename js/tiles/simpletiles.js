// Tileset
//
// name: string
// solid: 0 no collision, 1 solid, 2 liquid
// color: string

var tileset=[
	{name:'air',solid:0,color:'#6677FF',draw:basictiledraw},	// 0
	{name:'rock',solid:1,color:'#444444',draw:basictiledraw},	// 1
	{name:'earth',solid:1,color:'#554022',draw:basictiledraw},	// 2
	{name:'sand',solid:1,color:'#DDAA44',draw:basictiledraw},	// 3
	{name:'water',solid:2,color:'#2222FF',draw:liquid.drawtile}	// 4
]
