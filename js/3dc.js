var THREEDC={
	version:'0.1-a',
	allCharts:[]
};

THREEDC.renderAll=function() {
	for (var i = 0; i < THREEDC.allCharts.length; i++) {
		THREEDC.allCharts[i].render();
	};
}

/*base object whose methods are inherited by each implementation
* the properties of a chart are given by a function chain
*/
THREEDC.baseChart = function (_chart) {

	_chart.chartParts=[];

    _chart.render=function() {
    	//defined by each implementation
    	_chart.build();
    	for (var i = 0; i < _chart.chartParts.length; i++) {
    		scene.add(_chart.chartParts[i]);
    	};
    }

    _chart.group= function (group) {
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._group=group;
    	return _chart;
    }

    _chart.dimension= function (dimension) {
    	if(!arguments.length){
    		console.log('argument needed');
    		return;
    	}
    	_chart._dimension=dimension;
    	return _chart;
    }

    return _chart;
}

THREEDC.pieChart = function (coords) {

	this.coords=coords;

	var  extrudeOpts = {curveSegments:30, amount: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
	//by default
	var _radius=50;
	var _chart = THREEDC.baseChart({});

	THREEDC.allCharts.push(_chart);

	_chart.radius=function(radius){
		_radius=radius;
		return _chart;

	}

    _chart.build=function () {
   	    var valTotal=_chart._dimension.top(Infinity).length;
		var angPrev=0;
		var angToMove=0;

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	coords=[0,0,0];
	   }

		_chart._group.top(Infinity).forEach(function(p,i) {
				if(p.value){
				var hex_color=get_random_color();
				var origin_color='0x'+decimalToHexString(hex_color.slice(1,hex_color.length));
				var material = new THREE.MeshPhongMaterial();
				// Creats the shape, based on the value and the _radius
				var shape = new THREE.Shape();
				var angToMove = (Math.PI*2*(p.value/valTotal));
				shape.moveTo(0,0);
				shape.arc(0,0,_radius,angPrev,
				        angPrev+angToMove,false);
				shape.lineTo(0,0);
				var nextAng = angPrev + angToMove;

				var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts );
				var pieobj = new THREE.Mesh( geometry, material );
				pieobj.material.color.setHex(origin_color);
				pieobj.origin_color=origin_color;
				pieobj.rotation.set(0,0,0);
				pieobj.position.set(coords[0],coords[1],coords[2]);
				pieobj.name = "Commits:"+p.value+" Org:"+p.key;
				pieobj.info={
					org:p.key,
					commits:p.value
				}
				_chart.chartParts.push(pieobj);
				angPrev=nextAng;
			}
		});
    }

	return _chart;
}

THREEDC.barsChart = function (coords){

	this.coords=coords;

	var _chart = THREEDC.baseChart({});

	THREEDC.allCharts.push(_chart);

	_chart.build = function() {
	   	
	   var z=1;
	   var y=0;
	   var x=1;

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	coords=[0,0,0];
	   }

	   _chart._group.top(Infinity).forEach(function(p,i) {
	      //commit values are normalized to optimal visualization(/10)
	      if(p.value){
	 		var geometry = new THREE.CubeGeometry( 1, p.value/10, 10);
			y=p.value/10/2;
			var origin_color=0x0000ff;
			var material = new THREE.MeshLambertMaterial( {color: origin_color} );
			var cube = new THREE.Mesh(geometry, material);
			cube.origin_color=origin_color;
			cube.position.set(x+coords[0],y+coords[1],z+coords[2]);
			cube.name = "Commits:"+p.value+" "+p.key;
			cube.info={
				month:p.key,
				commits:p.value
			};
			_chart.chartParts.push(cube);
			x+=1;
		   }
		});
    }

    return _chart;
}

THREEDC.simpleLineChart= function (coords) {

	this.coords=coords;

	var _chart = THREEDC.baseChart({});

	THREEDC.allCharts.push(_chart);

	_chart.build = function() {
	   	
	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	coords=[0,0,0];
	   }

		var chartShape = new THREE.Shape();
		chartShape.moveTo( 0,0 );
		var x=0;

	   _chart._group.top(Infinity).forEach(function(p,i) {
			chartShape.lineTo( x, p.value/10 );
			x+=1.5;
		});
		chartShape.lineTo( x, 0 );
		chartShape.lineTo( 0, 0 );

		var extrusionSettings = {
			size: 30, height: 4, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var chartGeometry = new THREE.ExtrudeGeometry( chartShape, extrusionSettings );
		var materialSide = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
  		var extrudeChart = new THREE.Mesh( chartGeometry, materialSide );

		extrudeChart.position.set(coords[0],coords[1],coords[2]);
		scene.add(extrudeChart);

    }

    return _chart;

}

THREEDC.lineChart= function (coords) {

	this.coords=coords;

	var _chart = THREEDC.baseChart({});

	THREEDC.allCharts.push(_chart);

	_chart.build = function() {
	   	
	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	coords=[0,0,0];
	   }

		var chartShape = new THREE.Shape();
		chartShape.moveTo( 0,0 );
		var x=0;

	   _chart._group.top(Infinity).forEach(function(p,i) {
			chartShape.lineTo( x, p.value/10 );
			x+=1.5;
		});
		chartShape.lineTo( x, 0 );
		chartShape.lineTo( 0, 0 );

		var extrusionSettings = {
			size: 30, height: 4, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var chartGeometry = new THREE.ExtrudeGeometry( chartShape, extrusionSettings );
		var materialSide = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
  		var extrudeChart = new THREE.Mesh( chartGeometry, materialSide );

		extrudeChart.position.set(coords[0],coords[1],coords[2]);
		scene.add(extrudeChart);

    }

    return _chart;

}

THREEDC.bubbleChart= function (coords) {

	var _chart = THREEDC.baseChart({});

	THREEDC.allCharts.push(_chart);

	_chart.build= function () {

		var x=0;
		var y=0;
		var z=0;

	   if(_chart._group===undefined){
	   	console.log('You must define a group for this chart');
	   	return;
	   }
	   if(coords==undefined){
	   	this.coords=[0,0,0];
	   }
	   
		_chart._group.top(Infinity).forEach(function(p,i) {
			var geometry = new THREE.SphereGeometry(p.value/100,32,32);
			var material = new THREE.MeshLambertMaterial( {} );
			material.color.setHex( Math.random() * 0xffffff );
			var sphere = new THREE.Mesh( geometry, material );

			sphere.position.set(x+coords[0],y+coords[1],z+coords[2]);
			_chart.chartParts.push(sphere);
			x+=100;
		});
	}

	return _chart;
}

function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return '#'+c()+c()+c();
}

function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}

function showInfo (mesh) {

	  scene.remove(labelobj);
      var txt = mesh.name;
      var curveSeg = 3;
      var material = new THREE.MeshPhongMaterial( {color:0xf3860a,shading: THREE.FlatShading } );
      
      // Create a three.js text geometry
      var geometry = new THREE.TextGeometry( txt, {
        size: 8,
        height: 2,
        curveSegments: 3,
        font: "helvetiker",
        weight: "bold",
        style: "normal",
        bevelEnabled: false
      });
      // Positions the text and adds it to the scene
      labelobj = new THREE.Mesh( geometry, material );
      labelobj.position.z = mesh.position.z;
      labelobj.position.x = mesh.position.x-25;
      labelobj.position.y = mesh.position.y+60;
      //labelobj.rotation.set(3*Math.PI/2,0,0);
      scene.add(labelobj );
}

