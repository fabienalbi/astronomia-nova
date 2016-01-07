$(function() {
  var container;
  var camera, scene, renderer, controls;
  var fov = 25;
  var start = Date.now();

  // Set up canvas dimensions
  var width = 1500;
  var height = window.innerHeight;

  init();

  function init(){
    //set up scene and camera
    container = document.getElementById( 'space_container' );
    scene = new THREE.Scene();
    group = new THREE.Group();
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize(width, height);
    camera = new THREE.PerspectiveCamera(fov, width/ height, 50, 10000);
    camera.position.z = 100;
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene.add( camera );

    //move the camera around
    controls = new THREE.OrbitControls( camera );
    controls.minDistance = 100;
    controls.maxDistance = 400;

    //light
    var amlight = new THREE.AmbientLight( 0x888888 )
    scene.add( amlight );

    var dirlight = new THREE.DirectionalLight( 0xcccccc, 1 )
    dirlight.position.set(10,3,5)
    scene.add( dirlight );

    //gasplanet
    var planetmaterial = new THREE.ShaderMaterial({
      uniforms: { 
        tExplosion: {
          type: "t", 
          value: Textures.blueexplocolor
        },
        time: { // float initialized to 0
          type: "f", 
          value: 0.0 
        }
      },
      vertexShader: document.getElementById( 'gas-vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'gas-fragmentShader' ).textContent
    });

    var geometry = new THREE.IcosahedronGeometry( 15, 5 );
    var bluegasplanet = new THREE.Mesh( geometry, planetmaterial );
    scene.add(bluegasplanet);

    
    container.appendChild( renderer.domElement );
    animate();

    function animate() {
      requestAnimationFrame(animate);
      planetmaterial.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
      bluegasplanet.rotateY(2/1000);
      controls.update();
      renderer.render( scene, camera );
    }
  }
});