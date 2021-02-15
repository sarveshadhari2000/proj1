import * as THREE from "./libs/three/three.module.js"
import {OrbitControls} from "./libs/three/jsm/OrbitControls.js"
import {GLTFLoader} from "./libs/three/jsm/GLTFLoader.js"
import {FBXLoader} from "./libs/three/jsm/FBXLoader.js"
import {LoadingBar} from "./libs/LoadingBar.js"
import {vector3ToString} from "./libs/DebugUtils.js"
import { VRButton } from './libs/three/jsm/VRButton.js';
import { XRControllerModelFactory } from './libs/three/jsm/XRControllerModelFactory.js';
import { BoxLineGeometry } from './libs/three/jsm/BoxLineGeometry.js';
import { Stats } from './libs/stats.module.js';

class App
{
    constructor ()
    {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
        this.camera.position.set(0,0,4);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xaaaaaa);

        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        
        container.appendChild(this.renderer.domElement);

        
       

        this.ambient = new THREE.AmbientLight(0xffffff,0.5);
        this.scene.add(this.ambient);

        this.pointLight = new THREE.DirectionalLight(0xffffff,1);
        this.scene.add(this.pointLight);

        this.pointLight.position.set(1,1,1);


        const controls = new OrbitControls(this.camera,this.renderer.domElement);
        this.initScene();
        this.setupVR();
        this.renderer.setAnimationLoop(this.render.bind(this));

        window.addEventListener('resize',this.resize.bind(this))
    }

    random( min, max ){
        return Math.random() * (max-min) + min;
    }

    initScene()
    {
               this.radius = 0.08;

               this.room = new THREE.LineSegments(new BoxLineGeometry(6,6,6,10,10,10),new THREE.LineBasicMaterial({color:0x808080}));
               this.room.geometry.translate(0,3,0);
               this.scene.add(this.room);

               const geometry = new THREE.IcosahedronBufferGeometry(this.radius,2);

               for (let i=0;i<200;i++)
               {
                   const object = new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({color:0xff7700}));
                   
                   object.position.x = this.random(-2,2);
                   object.position.y = this.random(-2,2);
                   object.position.z = this.random(-2,2);

                   this.room.add(object);
               }

    }

    setupVR()
    {
        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer));
    }

    resize()
    {
           this.camera.aspect = window.innerWidth/window.innerHeight;
           this.camera.updateProjectionMatrix();
           this.renderer.setSize(window.innerWidth,window.innerHeight);
    }

    render()
    {
        this.renderer.render(this.scene,this.camera);
    }

    loadGLTF()
    {
        const self = this;
        const loader = new GLTFLoader().setPath("./assets/")

        loader.load(
            'office-chair.glb',
            function(gltf)
            {
                self.chair = gltf.scene;
                self.scene.add(gltf.scene);
                self.loadingBar.visible = false;
                self.renderer.setAnimationLoop(self.render.bind(self));
            },
            function(xhr)
            {
               self.loadingBar.progress = xhr.loaded/xhr.total;
            },
            function(err)
            {
                console.log("Error");
            }

        )
        
    }

    loadFBX()
    {
        const self = this;
        const loader = new FBXLoader().setPath("./assets/")

        loader.load(
            'office-chair.fbx',
            function(object)
            {
                self.chair = object;
                self.scene.add(object);
                self.loadingBar.visible = false;
                self.renderer.setAnimationLoop(self.render.bind(self));
            },
            function(xhr)
            {
               self.loadingBar.progress = xhr.loaded/xhr.total;
            },
            function(err)
            {
                console.log("Error");
            }

        )
    }
}

export {App};