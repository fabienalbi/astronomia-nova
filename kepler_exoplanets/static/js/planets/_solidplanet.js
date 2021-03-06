var solidPlanet = function(radius, textureType, textureBump, textureScale) {
  var container,winResize;
  var camera, scene, renderer, controls;
  var fov = 25;
  // Set up canvas dimensions
  var windowwidth = window.innerWidth;
  var width = windowwidth * 0.66667;
  var height = window.innerHeight;

  init(radius, textureType, textureBump, textureScale);

  function init(radius, textureType, textureBump, textureScale){
    //set up scene and camera
    container = document.getElementById( 'space_container' );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor( 0xffffff, 0);
    renderer.setSize(width, height);
    camera = new THREE.PerspectiveCamera(fov, width/ height, 50, 10000);
    camera.position.z = 100;
    scene.add( camera );
    //control camera
    controls = new THREE.OrbitControls( camera );
    controls.minDistance = 100;
    controls.maxDistance = 400;
    //light
    var amlight = new THREE.AmbientLight( 0x888888 )
    scene.add( amlight );
    var dirlight = new THREE.DirectionalLight( 0xcccccc, 1 )
    dirlight.position.set(10,3,5)
    scene.add( dirlight );
    //habitableplanet
    var material = new THREE.MeshPhongMaterial({
      //NOTE: Previously Textures.habitabletexture and Textures.habitablebump
      map: textureType,
      bumpMap: textureBump,
      bumpScale: textureScale });
    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var solid_planet = new THREE.Mesh( geometry, material );
    scene.add(solid_planet);

    container.appendChild( renderer.domElement );
    animate();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      solid_planet.rotateY(2/1000);
      //resizes canvas when window is
      winResize = new THREEx.WindowResize(renderer, camera);
      renderer.render( scene, camera );
    }
  }
};
