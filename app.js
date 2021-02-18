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
import { ARButton } from "e:/[ freecourseweb.com ] udemy - learn to create webxr, vr and ar, experiences using three.js/~get your course here !/2. a three.js primer/libs/arbutton.js"

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
        this.setupAR();

        window.addEventListener('resize',this.resize.bind(this))
    }

    random( min, max ){
        return Math.random() * (max-min) + min;
    }

    initScene()
    {
            this.geometry = new THREE.BoxBufferGeometry(0.06,0.06,0.06);
            this.meshes = [];
    }

    setupAR()
    {
        this.renderer.xr.enabled = true;
        let controller;
        const self = this;

        function onSelect()
        {
            const material = new THREE.MeshPhongMaterial({color:(0xffffff*Math.random())});
            const mesh = new THREE.Mesh(this.geometry,material);
            mesh.position.set(0,0,-0.3).applyMatrix4(controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            this.scene.add(mesh);
            this.meshes.add(mesh);
        }

        const btn = new ARButton(this.renderer);

        controller = this.renderer.xr.getController(0);
        controller.addEventListener('select',onSelect);
        this.scene.add(controller);
        this.renderer.setAnimationLoop(this.render.bind(this));

    }

    resize()
    {
           this.camera.aspect = window.innerWidth/window.innerHeight;
           this.camera.updateProjectionMatrix();
           this.renderer.setSize(window.innerWidth,window.innerHeight);
    }

    render()
    {
        this.meshes.forEach((mesh)=>{mesh.rotateY(0.02);});
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
