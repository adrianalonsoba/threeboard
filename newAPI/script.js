
//////////
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, stats;
var dashBoard;

//JSON data saved here
var json_data;

//CROSSFILTER VARS

 var cf;

 var dimByMonth;

 var groupByMonth;

  var dimByOrg;

  var groupByOrg;


  var dimByRepo;

  var groupByRepo;

// initialization
  //getJSON call, draw meshes with data
   $.getJSON("../jsons/scm-commits.json", function(data) {
      json_data=data;
      init();
      // animation loop / game loop
      animate();
   });


///////////////
// FUNCTIONS //
///////////////

function init () {

   ///////////
   // SCENE //
   ///////////
   scene = new THREE.Scene();

   ////////////
   // CAMERA //
   ////////////
   // set the view size in pixels (custom or according to window size)
   var SCREEN_WIDTH = window.innerWidth;
   var SCREEN_HEIGHT = window.innerHeight;
   // camera attributes
   var VIEW_ANGLE = 45;
   var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
   var NEAR = 0.1;
   var FAR = 20000;
      // set up camera
   camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
   // add the camera to the scene
   scene.add(camera);
   // the camera defaults to position (0,0,0)
   //    so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
   camera.position.set(0,150,400);
   camera.lookAt(scene.position);

   //////////////
   // RENDERER //
   //////////////
   renderer = new THREE.WebGLRenderer( {antialias:true} );
   renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   renderer.setClearColor( 0xd8d8d8 );

   // attach div element to variable to contain the renderer
   container = document.getElementById( 'ThreeJS' );
   // attach renderer to the container div
   container.appendChild( renderer.domElement );

    ////////////
  // EVENTS //
  ////////////


  // automatically resize renderer
  THREEx.WindowResize(renderer, camera);
    // toggle full-screen on given key press
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

   ///////////
   // LIGHTS //
   ///////////
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(0,2500,2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(0,2500,2500);
  scene.add( lightbulb );
  
   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(-2500,2500,-2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(-2500,2500,-2500);
  scene.add( lightbulb );

   var light = new THREE.PointLight(0xffffff,0.8);
   light.position.set(2500,2500,-2500);
   scene.add(light);

  // create a small sphere to show position of light
  var lightbulb = new THREE.Mesh( 
    new THREE.SphereGeometry( 100, 16, 8 ), 
    new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
  );
  lightbulb.position.set(2500,2500,-2500);
  scene.add( lightbulb );


   var ambientLight = new THREE.AmbientLight(0x111111);
   // scene.add(ambientLight);

   // create a set of coordinate axes to help orient user
   //    specify length in pixels in each direction
   var axes = new THREE.AxisHelper(1000);
   scene.add(axes);


 //CUSTOM dashBoardBOARD//

   var parsed_data=[];

  // Crossfilter and dc.js format
  json_data.values.forEach(function (value) {
    var record = {}
    json_data.names.forEach(function (name, index) {
        if (name == "date") {
          var date = new Date(value[index]*1000);
          record[name] = date;
          record.month = new Date(date.getFullYear(), date.getMonth(), 1);
          record.hour = date.getUTCHours();
        } else {
          record[name] = value[index];
        }
    });
    parsed_data.push(record);
  });

  cf=crossfilter(parsed_data);
  console.log(parsed_data);

  //create a dimension by month

  dimByMonth= cf.dimension(function(p) {return p.month;});

  groupByMonth= dimByMonth.group();

  //create a dimension by org

  dimByOrg= cf.dimension(function(p) {return p.org;});

  groupByOrg= dimByOrg.group();


  //create a dimension by author

  dimByAuthor= cf.dimension(function(p) {return p.author;});

  groupByAuthor= dimByAuthor.group();



  //create a dimension by repository

  dimByRepo= cf.dimension(function(p) {return p.repo;});

  groupByRepo= dimByRepo.group();


  //data without CF

  var data1= [{key:'monday',value:20},{key:'tuesday',value:80},{key:'friday',value:30}];

  var data2= [{key:'may',value:200},{key:'june',value:100},{key:'july',value:250}];

  //example data for cloud



    //3Ddata without CF

   data= [{key1:'january',key2:'apple',value:23},{key1:'february',key2:'apple',value:31},{key1:'march',key2:'apple',value:10},{key1:'april',key2:'apple',value:59},

            {key1:'january',key2:'google',value:34},{key1:'february',key2:'google',value:89},{key1:'march',key2:'google',value:53},{key1:'april',key2:'google',value:76},

            {key1:'january',key2:'microsoft',value:10},{key1:'february',key2:'microsoft',value:5},{key1:'march',key2:'microsoft',value:4},{key1:'april',key2:'microsoft',value:12},

            {key1:'january',key2:'sony',value:56},{key1:'february',key2:'sony',value:21},{key1:'march',key2:'sony',value:23},{key1:'april',key2:'sony',value:12}
  ];

      //4Ddata without CF

   data2= [{key1:'january',key2:'apple',value:23,value2:Math.random()*50},{key1:'february',key2:'apple',value:31,value2:Math.random()*50},{key1:'march',key2:'apple',value:10,value2:Math.random()*50},{key1:'april',key2:'apple',value:59,value2:Math.random()*50},

            {key1:'january',key2:'google',value:34,value2:Math.random()*50},{key1:'february',key2:'google',value:89,value2:Math.random()*50},{key1:'march',key2:'google',value:53,value2:Math.random()*50},{key1:'april',key2:'google',value:76,value2:Math.random()*50},

            {key1:'january',key2:'sony',value:34,value2:Math.random()*50},{key1:'february',key2:'sony',value:89,value2:Math.random()*50},{key1:'march',key2:'sony',value:53,value2:Math.random()*50},{key1:'april',key2:'sony',value:76,value2:Math.random()*50}

  ];


  dashBoard = THREEDC.dashBoard(scene,renderer,container);



/*
  var PIE= THREEDC.pieChart([0,0,0]);

  PIE.data(data1);

  var bars= THREEDC.barsChart([0,0,0]);

  bars.data(data1).gridsOn();

  var line= THREEDC.lineChart([-200,0,0]);

  line.data(data1).gridsOn();

  var curve = THREEDC.smoothCurveChart([200,0,0]);

  curve.data(data1).gridsOn();


    var TDBARS = THREEDC.TDbarsChart([400,0,0]);

TDBARS.data(data).gridsOn();


  var curve = THREEDC.smoothCurveChart([200,0,0]);

  curve.data(data1).gridsOn();





    var bub = THREEDC.bubbleChart([-400,0,0]);

bub.data(data2).gridsOn();



  dashBoard.addChart(PIE);
  dashBoard.addChart(bars);
  dashBoard.addChart(line);
  dashBoard.addChart(curve);
  dashBoard.addChart(TDBARS);
   dashBoard.addChart(bub);

*/



  var bars1 =  THREEDC.barsChart([0,0,0]);
  bars1.group(groupByOrg)
      .dimension(dimByOrg)
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .gridsOn()
      .depth(30)
      .numberOfYLabels(4)
      .color(0x00ffff);

   var bars2 =  THREEDC.barsChart([100,0,100]);
       bars2.group(groupByAuthor)
      .dimension(dimByAuthor)
      .gridsOn()
      .width(200)
      .height(200)
      .numberOfXLabels(7)
      .depth(30)
      .color(0xff0000);


    var line =  THREEDC.lineChart([300,100,200]);
       line.group(groupByMonth)
      .dimension(dimByMonth)
      .width(400)
      .numberOfXLabels(7)
      .numberOfYLabels(5)
      .gridsOn()
      .depth(30)

      .height(200)
      .color(0x0000ff);

 dashBoard.addChart(bars1);
  dashBoard.addChart(bars2);

 dashBoard.addChart(line);
 

 var panel =THREEDC.Panel();
 
 dashBoard.addPanel(panel);



}

function animate()
{
   requestAnimationFrame( animate );
   render();
   update();
}

function render()
{
   renderer.render( scene, camera );
}

function update()
{
  dashBoard.controls.update();
}
