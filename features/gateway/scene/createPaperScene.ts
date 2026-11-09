import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  OrthographicCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from "three";
import { paperPalette } from "../constants/gateway.constants";
import { createCrumpleMesh } from "./crumpleMesh";
import { drawInk, drawPaper, drawShadow, seededRandom } from "./paperArt";

export type PaperState = {
  /** 0 → 1: ink prints across the sheet */
  ink: number;
  /** 0 → 1: flat sheet → paper ball */
  crumple: number;
  /** ball position in CSS px from the screen centre (y up) */
  x: number;
  y: number;
  /** extra tumbling while in the air, in turns */
  spin: number;
  /** rolling angle along the floor, in radians (positive = rolling left) */
  roll: number;
  /** 0 → 1: impact squash when the ball hits the floor */
  squash: number;
};

type SceneOptions = {
  canvas: HTMLCanvasElement;
  logo: HTMLImageElement;
  fonts: { display: string; ui: string };
};

/**
 * Builds the welcome sheet as a real 3D surface. An orthographic camera maps
 * one world unit to one CSS pixel, so the flat sheet covers the screen exactly.
 */
export function createPaperScene({ canvas, logo, fonts }: SceneOptions) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // ball size: ~44px radius on a 1440×809 screen, never tiny on phones
  const radius = Math.min(Math.max(Math.min(width, height) * 0.055, 30), 62);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);

  const camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 6000);
  camera.position.z = 3000;

  const scene = new Scene();

  // Lighting is tuned so the flat sheet lands on the hero wall colour (~#f0debe)
  // (Lambert divides by π, hence the π factors); folds then catch light/shade.
  // A faint warm tint keeps the folds reading as cream paper, not grey.
  scene.add(new AmbientLight(0xfffaf4, 0.72 * Math.PI));
  const sun = new DirectionalLight(0xfff6ec, 0.44 * Math.PI);
  sun.position.set(-0.35, 0.45, 0.82);
  scene.add(sun);

  // --- textures -------------------------------------------------------------
  const texScale = Math.min(dpr, 2048 / Math.max(width, height));
  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const toTexture = (source: HTMLCanvasElement) => {
    const texture = new CanvasTexture(source);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = anisotropy;
    return texture;
  };
  const paperTexture = toTexture(drawPaper(width * texScale, height * texScale, texScale, seededRandom(2008)));
  const inkTexture = toTexture(drawInk(width, height, texScale, logo, fonts));

  // --- the sheet ------------------------------------------------------------
  const sheet = createCrumpleMesh(width, height, radius, seededRandom(142));
  const inkUniform = { value: 0 };
  const material = new MeshLambertMaterial({ map: paperTexture, side: DoubleSide, flatShading: true });
  const [br, bg, bb] = paperPalette.backSide;

  // Print the ink with a soft diagonal sweep, multiplied into the paper like
  // real ink; the back of the sheet stays blank paper.
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uInkMap = { value: inkTexture };
    shader.uniforms.uInk = inkUniform;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D uInkMap;\nuniform float uInk;")
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        {
          vec4 ink = texture2D(uInkMap, vMapUv);
          float sweep = uInk * 1.3 - 0.15;
          float along = vMapUv.x * 0.9 + (1.0 - vMapUv.y) * 0.1;
          float reveal = 1.0 - smoothstep(sweep - 0.1, sweep, along);
          diffuseColor.rgb *= mix(vec3(1.0), ink.rgb, ink.a * reveal);
          if (!gl_FrontFacing) diffuseColor.rgb = vec3(${br}, ${bg}, ${bb});
        }`
      );
  };

  const paper = new Mesh(sheet.geometry, material);
  paper.frustumCulled = false;
  // ballGroup: position + squash (screen axes) → spinGroup: rotation → paper
  const spinGroup = new Group();
  spinGroup.add(paper);
  const ballGroup = new Group();
  ballGroup.add(spinGroup);
  scene.add(ballGroup);
  const viewScale = { x: 1, y: 1, z: 1 }; // set on resize

  // --- contact shadow on the floor ------------------------------------------
  const shadowTexture = new CanvasTexture(drawShadow());
  const shadowMaterial = new MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0, depthWrite: false });
  const shadow = new Mesh(new PlaneGeometry(radius * 2.6, radius * 0.7), shadowMaterial);
  shadow.position.z = -radius * 4;
  scene.add(shadow);

  /** World y of the ball's centre when resting on the floor (set by the timeline). */
  let restY = -height / 2 + radius;

  const smoothstep = (a: number, b: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  const update = ({ ink, crumple, x, y, spin, roll, squash }: PaperState) => {
    inkUniform.value = ink;
    sheet.setProgress(crumple);

    // tumble grows late (crumple²) so the big sheet doesn't tilt early
    const tumble = crumple * crumple;
    const turn = spin * Math.PI * 2;
    spinGroup.rotation.set(tumble * 0.9 + turn * 0.8, -tumble * 0.7 + turn * 0.35, tumble * 0.35 + turn + roll);

    // squash on impact, flattening against the floor (pivot at the contact point)
    const sq = squash * 0.22;
    ballGroup.scale.set(viewScale.x * (1 + sq), viewScale.y * (1 - sq), viewScale.z * (1 + sq));
    ballGroup.position.set(x, y - radius * sq, 0);

    // shadow stays on the floor: sharper and darker as the ball comes down
    const height01 = Math.min(1, Math.max(0, (y - restY) / (radius * 6)));
    const near = 1 - height01;
    shadow.position.set(x, restY - radius * 0.92, shadow.position.z);
    shadow.scale.set(0.55 + 0.45 * near, 0.55 + 0.45 * near, 1);
    shadowMaterial.opacity = smoothstep(0.75, 1, crumple) * (0.15 + 0.4 * near);

    renderer.render(scene, camera);
  };

  const setRestY = (value: number) => {
    restY = value;
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;
    camera.updateProjectionMatrix();
    // stretch the original sheet to the new viewport (intro is brief)
    viewScale.x = w / width;
    viewScale.y = h / height;
    viewScale.z = Math.min(viewScale.x, viewScale.y);
  };

  const dispose = () => {
    sheet.geometry.dispose();
    material.dispose();
    paperTexture.dispose();
    inkTexture.dispose();
    shadow.geometry.dispose();
    shadowMaterial.dispose();
    shadowTexture.dispose();
    renderer.dispose();
  };

  return { width, height, radius, update, setRestY, resize, dispose };
}

export type PaperScene = ReturnType<typeof createPaperScene>;
