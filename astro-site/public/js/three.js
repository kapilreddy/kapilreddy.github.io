let PARTICLE_COLOR = 0xD9C2FF;
let BG_COLOR = 0x323232;
let scene, camera, renderer, particleSystem, trailSystem;
let currentSection = 0;
let targetSection = 0;
let transitionProgress = 1;
let debugMode = false;
let isAutoScrolling = false;
const clock = new THREE.Clock();


const PARTICLE_COUNT = 2000;
let TRAIL_LENGTH = 20;
let SPEED_MULTIPLIER = 0.02;


const FLOW_SPEED = 0.2;
const RIVER_WIDTH = 20;
const RIVER_LENGTH = 100;
const MEANDER_FREQUENCY = 0.01;
const MEANDER_AMPLITUDE = 20;
const TURBULENCE = 0.1;

// Add this function to create initial positions for the river flow
function createRiverFlowPositions(particleCount) {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
	positions[i * 3] = Math.random() * RIVER_LENGTH - RIVER_LENGTH / 2;
	positions[i * 3 + 1] = (Math.random() - 0.5) * RIVER_WIDTH;
	positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
}

PARTICLE_COLOR = 0x8673A4;
BG_COLOR = 0x323232;

function switchThreeTheme (theme) {
    if (theme == "dark") {
        PARTICLE_COLOR = 0x8673A4;
        BG_COLOR = 0x323232;
    } else {
	PARTICLE_COLOR = 0x68A8A9;
	BG_COLOR = 0xDDDDDD;
    }

    threeJSINIT();
}

function threeJSINIT() {
    if(scene) {
	delete scene;
    }

    scene = new THREE.Scene();
    const bgColor = new THREE.Color( BG_COLOR );
    scene.background = bgColor;

    riverFlowPositions = createRiverFlowPositions(PARTICLE_COUNT);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    camera.position.z = 50;
    camera.lookAt(0, 0, 0);
    createParticlesAndTrails();

}

function init() {
    threeJSINIT();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('scene-container').appendChild(renderer.domElement);
    animate();
}

function createParticlesAndTrails() {
    const sphereGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({
	color: PARTICLE_COLOR,
	transparent: true,
	opacity: 0.05	
    });

    // Create particles
    particleSystem = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, PARTICLE_COUNT);
    scene.add(particleSystem);

    // Initialize particle positions
    const tempObject = new THREE.Object3D();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
	tempObject.position.set(
	    (Math.random() - 0.5) * 100,
	    (Math.random() - 0.5) * 100,
	    (Math.random() - 0.5) * 100
	);
	tempObject.updateMatrix();
	particleSystem.setMatrixAt(i, tempObject.matrix);
    }
    particleSystem.instanceMatrix.needsUpdate = true;

    // Create trails
    trailSystem = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, PARTICLE_COUNT * TRAIL_LENGTH);
    scene.add(trailSystem);

    // Initialize trail positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
	for (let j = 0; j < TRAIL_LENGTH; j++) {
	    const index = i * TRAIL_LENGTH + j;
	    tempObject.position.set(
		(Math.random() - 0.5) * 100,
		(Math.random() - 0.5) * 100,
		(Math.random() - 0.5) * 100
	    );
	    tempObject.scale.setScalar(1 - j / TRAIL_LENGTH); // Scale down trail segments
	    tempObject.updateMatrix();
	    trailSystem.setMatrixAt(index, tempObject.matrix);
	}
    }
    trailSystem.instanceMatrix.needsUpdate = true;
}

function noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = p[X] + Y, B = p[X + 1] + Y;
    return lerp(v, lerp(u, grad(p[A], x, y), grad(p[B], x - 1, y)),
		lerp(u, grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1)));
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t, a, b) { return a + t * (b - a); }
function grad(hash, x, y) {

    const h = hash & 15;
    const u = h < 8 ? x : y,
	  v = h < 4 ? y : h == 12 || h == 14 ? x : 0;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

const p = new Array(512);
const permutation = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
for (let i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i];
function getTargetPosition(index, section, time) {
    const i = index % PARTICLE_COUNT;
    const t = time * SPEED_MULTIPLIER; // Adjust this multiplier to change overall animation speed


    switch (section) {
    case 0: // About
	return new THREE.Vector3(
	    Math.sin(i / PARTICLE_COUNT * Math.PI * 2 + t) * 40,
	    Math.cos(i / PARTICLE_COUNT * Math.PI * 2 + t) * 40,
	    Math.sin(t + i * 0.1) * 10
	);
    case 1: // Skills
	var angle = i / PARTICLE_COUNT * Math.PI * 20 + t;
	var radius = 30 + Math.sin(t * 2 + i * 0.1) * 10;
	return new THREE.Vector3(
	    Math.cos(angle) * radius,
	    Math.sin(angle) * radius,
	    Math.cos(t + i * 0.1) * 10
	);

    case 2: // Skills
	var angle = i / PARTICLE_COUNT * Math.PI * 2 + t;
	var radius = 30 + Math.sin(t * 2 + i * 0.1) * 10;
	return new THREE.Vector3(
	    Math.cos(angle) * radius,
	    Math.sin(angle) * radius,
	    Math.cos(t + i * 0.1) * 10
	);

    case 3: // Skills
	var angle = i / PARTICLE_COUNT * Math.PI * 50 + t;
	var radius = 30 + Math.sin(t * 2 + i * 0.1) * 10;
	return new THREE.Vector3(
	    Math.cos(angle) * radius,
	    Math.sin(angle) * radius,
	    Math.cos(t + i * 0.1) * 10
	);

    default:
	return new THREE.Vector3();

    }
}

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (transitionProgress < 1) {
	transitionProgress += 0.02;
    }

    const tempObject = new THREE.Object3D();
    const tempTrail = new THREE.Object3D();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
	particleSystem.getMatrixAt(i, tempObject.matrix);
	tempObject.position.setFromMatrixPosition(tempObject.matrix);

	const currentTarget = getTargetPosition(i, currentSection, time);
	const nextTarget = getTargetPosition(i, targetSection, time);

	// Interpolate between current section and target section
	const targetPos = new THREE.Vector3().lerpVectors(currentTarget, nextTarget, transitionProgress);

	// Smoothly move towards the target position
	tempObject.position.lerp(targetPos, 0.1);

	// Update particle position
	tempObject.updateMatrix();
	particleSystem.setMatrixAt(i, tempObject.matrix);

	// Update trail with a more pronounced fade effect
	for (let j = TRAIL_LENGTH - 1; j > 0; j--) {
	    const currentIndex = i * TRAIL_LENGTH + j;
	    const prevIndex = i * TRAIL_LENGTH + j - 1;

	    trailSystem.getMatrixAt(prevIndex, tempTrail.matrix);
	    tempTrail.position.setFromMatrixPosition(tempTrail.matrix);

	    // Exponential scale down for more prominent trail fade
	    const scale = Math.pow(0.95, j);

	    tempTrail.updateMatrix();
	    trailSystem.setMatrixAt(currentIndex, tempTrail.matrix);
	}

	// Set the front of the trail to the current particle position
	tempTrail.position.copy(tempObject.position);
	tempTrail.scale.setScalar(1);
	tempTrail.updateMatrix();
	trailSystem.setMatrixAt(i * TRAIL_LENGTH, tempTrail.matrix);
    }

    particleSystem.instanceMatrix.needsUpdate = true;
    trailSystem.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);

    if (debugMode) {
	const fps = Math.round(1 / clock.getDelta());
	document.getElementById('fps-counter').textContent = `FPS: ${fps}`;
    }
}

function getRiverFlowPosition(index, time) {
    const ix = index * 3;
    const iy = index * 3 + 1;
    const iz = index * 3 + 2;

    let x = riverFlowPositions[ix];
    let y = riverFlowPositions[iy];
    let z = riverFlowPositions[iz];

    // Update position
    x += FLOW_SPEED;

    // Meandering path
    const meander = Math.sin(x * MEANDER_FREQUENCY + time * 0.2) * MEANDER_AMPLITUDE;
    y += (meander - y) * 0.1;

    // Add some vertical movement
    z += Math.sin(x * 0.02 + time * 0.5) * 0.2;

    // Turbulence
    y += (Math.random() - 0.5) * TURBULENCE;
    z += (Math.random() - 0.5) * TURBULENCE;

    // Reset particles that have flowed past the end
    if (x > RIVER_LENGTH / 2) {
	x = -RIVER_LENGTH / 2;
	y = (Math.random() - 0.5) * RIVER_WIDTH;
	z = (Math.random() - 0.5) * 10;
    }

    // Update the positions array
    riverFlowPositions[ix] = x;
    riverFlowPositions[iy] = y;
    riverFlowPositions[iz] = z;

    return new THREE.Vector3(x, z, y);
}

// Modify your init function to create initial river flow positions
let riverFlowPositions;


function handleScroll() {
    if(!isAutoScrolling) {

	const container = document.querySelector('.container');
	const scrollPosition = document.documentElement.scrollTop;
	const windowHeight = window.innerHeight;
	let scrollDiff = (Math.round(scrollPosition / windowHeight)) - (scrollPosition / windowHeight);
	let newSection = null;
	console.log(Math.abs(scrollDiff));
	if (Math.abs(scrollDiff) > 0.1) {
	    newSection = currentSection + 1;
	}

	

	if (newSection && newSection !== currentSection) {
	    updateNavDots(newSection);
	    scrollToSection(newSection);
	}

    }
}

function changeSection(newSection) {
    currentSection = targetSection;
    targetSection = newSection;
    transitionProgress = 0;
}




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

var test = null;
function scrollToSection(index) {
    console.log("scrolling to section");
    isAutoScrolling = true;
    test = document.querySelectorAll('section')[index];
    setTimeout(() => {
	document.querySelectorAll('section')[index].scrollIntoView({behavior: "auto" });
	updateNavDots(index);
	changeSection(index);
	setTimeout(() => {
	    isAutoScrolling = false;
	}, 2000);

    }, 300);


}

function updateNavDots(index) {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
	dot.classList.toggle('active', i === index);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML += "<div id='scene-container'></div>";
    init();
    const container = document.querySelector('.container');

    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
	dot.addEventListener('click', () => scrollToSection(index));
    });

    updateNavDots(0);
}, true);

window.addEventListener('resize', onWindowResize);

document.addEventListener('DOMContentLoaded', () => {
            const container = document.querySelector('.intro-container');
            let isScrolling;

            container.addEventListener('scroll', () => {
                window.clearTimeout(isScrolling);
                isScrolling = setTimeout(() => {
                    const scrollTop = container.scrollTop;
                    const windowHeight = window.innerHeight;
                    const snapPoint = Math.round(scrollTop / windowHeight) * windowHeight;
		    
		    const scrollPosition = container.scrollTop;
		    newSection = Math.round(scrollPosition / windowHeight);
		    console.log(newSection);
		    updateNavDots(newSection);		    
		    changeSection(newSection);
                    container.scrollTo({
                        top: snapPoint,
                        behavior: 'smooth'
                    });
                }, 66); // Adjust this value to change sensitivity
            });
        });
