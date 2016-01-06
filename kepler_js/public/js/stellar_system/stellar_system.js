$(function() {
  var controls, camera, scene, renderer, container, intersects;
  circles = [];

  // Set up canvas dimensions
  var width = 1000;
  var height = window.innerHeight;

  // Set up planets/sun textures
  var texloader = new THREE.TextureLoader();
  var explocolor = texloader.load('/static/images/star.png');
  var gascolor = texloader.load('/static/images/redgas.png');
  var texture = texloader.load('/static/images/rocky.jpg');
  var bump = texloader.load('/static/images/rockybump.jpg');

  // Set up tools for hover and click events
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2(), INTERSECTED;
  
  start();

  function start(){
    //Scene creation
    scene = new THREE.Scene();
    container = document.getElementById( 'space_container' );

    // PerspectiveCamera creation and Set up. Parameters
    // 1. FOV – We’re using 45 degrees for our field of view.
    // 2. Aspect – We’re simply dividing the browser width and height to get an aspect ratio.
    // 3. Near – This is the distance at which the camera will start rendering scene objects.
    // 4. Far – Anything beyond this distance will not be rendered. Perhaps more commonly known as the draw distance.
    camera = new THREE.PerspectiveCamera(75, width/height, 50, 1000);
    camera.position.set(0, 0, 100);
    scene.add(camera);

    // Set up camera controls (using Orbit)
    controls = new THREE.OrbitControls( camera );
    controls.rotateSpeed = 1;
    controls.minDistance = 100;
    controls.maxDistance = 500;

    // Create the WebGL renderer and append it to the DOM bia the body element
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Create and add the star to the stellar system
    var geometry = new THREE.IcosahedronGeometry( 14, 5 );
    starmaterial = new THREE.ShaderMaterial({
      uniforms: { 
        tExplosion: {
          type: "t", 
          value: explocolor
        },
        time: { // float initialized to 0
          type: "f", 
          value: 0.0 
        }
      },

      vertexShader: document.getElementById( 'star-vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'star-fragmentShader' ).textContent
    });
    star = new THREE.Mesh(geometry, starmaterial);
    scene.add( star );
    pointLight = new THREE.PointLight( 0xffffff );
    scene.add( pointLight );
    pointLight.add( star );

    // Circle
    var circleSegments = 64;
    var circleMaterial = new THREE.LineBasicMaterial( { color: 0xF0C400 } );

    // Create and add three planets to the stellar system
    //PLANET 1
    geometry = new THREE.SphereGeometry(3.08, 15, 15);
    var material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 1  });
    planet1 = new THREE.Mesh(geometry, material);
    scene.add(planet1);
    planet1.position.set(0, 18, 0);
    // CIRCLE 1
    geometry = new THREE.CircleGeometry( 18, circleSegments );
    geometry.vertices.shift();
    var circle = new THREE.Line(geometry,  circleMaterial);
    circles.push(circle);
    scene.add(circle);

    //PLANET 2
    planetmaterial = new THREE.ShaderMaterial({
      uniforms: { 
        tExplosion: {
          type: "t", 
          value: gascolor
        },
        time: { // float initialized to 0
          type: "f", 
          value: 0.0 
        }
      },
    vertexShader: document.getElementById( 'gas-vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'gas-fragmentShader' ).textContent
    });
    geometry = new THREE.IcosahedronGeometry( 3.16, 5 );
    planet2 = new THREE.Mesh( geometry, planetmaterial );
    scene.add(planet2);
    planet2.position.set(0, 30, 0);
    // CIRCLE 2
    geometry = new THREE.CircleGeometry( 30, circleSegments );
    geometry.vertices.shift();
    circle = new THREE.Line(geometry,  circleMaterial);
    circles.push(circle);
    scene.add(circle);

    // PLANET 3
    material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.02 });
    geometry = new THREE.SphereGeometry( 3.4, 15, 15 );
    planet3 = new THREE.Mesh( geometry, material );
    scene.add(planet3);
    planet3.position.set(0, 50, 0);
    //CIRCLE 3 
    geometry = new THREE.CircleGeometry( 50, circleSegments );
    geometry.vertices.shift();
    circle = new THREE.Line( geometry,  circleMaterial );
    circles.push(circle);
    scene.add(circle);
      
    t = 0;
    y1 = planet1.position.y;
    y2 = planet2.position.y;
    y3 = planet3.position.y;
    x = planet1.position.x;
    launch = Date.now();

    animate();

  }

  function animate() {
    requestAnimationFrame(animate);
    starmaterial.uniforms[ 'time' ].value = .00025 * ( Date.now() - launch );
    t += 0.01;
    star.rotation.z += 0.005;
    planet1.rotation.z += 0.03;
    planet2.rotation.z += 0.04;
    planet3.rotation.z += 0.05;

    planet1.position.y = y1 * Math.cos(t) + x * Math.sin(t);
    planet1.position.x = x * Math.cos(t) - y1 * Math.sin(t);

    planet2.position.y = y2 * Math.cos(t * 0.5) + x * Math.sin(t * 0.5);
    planet2.position.x = x * Math.cos(t * 0.5) - y2 * Math.sin(t * 0.5);

    planet3.position.y = y3 * Math.cos(t * 1.2) + x * Math.sin(t * 1.2);
    planet3.position.x = x * Math.cos(t * 1.2) - y3 * Math.sin(t * 1.2);

    renderer.render(scene, camera);
    controls.update();
  }

  // Make the planets clickable (for now, it alerts the coordinates)
  document.addEventListener('dblclick', onDocumentMouseClick, false);
  function onDocumentMouseClick() {
    event.preventDefault();
    grabPlanets();
    if (intersects.length > 0) {
      alert(intersects[0].object);
    }
    if (intersects.length == 0) {
      console.log(camera.position);
      if (camera.position.z == 75) { camera.position.set(0, 75, 0); }
      else if (Math.round(camera.position.y) == 75) { camera.position.set(0, -60, 60); }
      else { camera.position.set(0, 0, 75); }
    }

  }

  // Deactivate orbit controls when interacting with the panel
  $('.sidebar').on('mouseenter', function() {
    controls.enabled = false;
    skybox_controls.enabled = false;
    circles.map(function(circle){circle.visible = false});
  });

  $('.sidebar').on('mouseleave', function() {
    controls.enabled = true;
    skybox_controls.enabled = true;
    circles.map(function(circle){circle.visible = true});
  });

  // Register the targeted planet with click events
  function grabPlanets() {
    var offset = {
      x: document.getElementsByTagName("canvas")[0].offsetLeft,
      y: document.getElementsByTagName("canvas")[0].offsetTop,
    }
    mouse.x = ((event.clientX - offset.x) / renderer.domElement.width) * 2 - 1;
    mouse.y = 1 - ((event.clientY - offset.y) / renderer.domElement.height) * 2;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, true);
  };
});