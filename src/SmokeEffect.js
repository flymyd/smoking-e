import * as THREE from "three";
import Partical from "./Partical.js";

export async function smokeEffect(scene, smokeTexture) {
  if (!smokeTexture) return;
  // 先创建一个空的缓冲几何体
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
  geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
  geometry.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
  geometry.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array([]), 1)); // 点的放大量，用1个浮点数表示

  // 创建材质
  const material = new THREE.PointsMaterial({
    color: '#FFF',
    map: smokeTexture, // 纹理图
    transparent: true,// 开启透明度
    depthWrite: false, // 禁止深度写入
  });

  // 修正着色器
  material.onBeforeCompile = function (shader) {
    const vertexShader_attribute = `
        attribute float a_opacity;
        attribute float a_size;
        attribute float a_scale;
        varying float v_opacity;
        void main() {
          v_opacity = a_opacity;
        `
    const vertexShader_size = `
        gl_PointSize = a_size * a_scale;
        `
    shader.vertexShader = shader.vertexShader.replace('void main() {', vertexShader_attribute)
    shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

    const fragmentShader_varying = `
        varying float v_opacity;
        void main() {          
      `
    const fragmentShader_opacity = `
        gl_FragColor = vec4( outgoingLight, diffuseColor.a * v_opacity );         
      `
    shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
    shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentShader_opacity)
  }
  // 创建点，并添加进场景
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // 创建粒子
  let particalList = []
  // setInterval(() => {
  //   particalList.push(new Partical(1, {x: 0, y: -50, z: 0}))
  // }, 500)
  particalList.push(new Partical(10, {x: 0, y: -50, z: 0}))

  // 校验粒子，并更新粒子位置等数据
  setInterval(() => {
    particalList = particalList.filter(p => {
      p.update()
      return p.updateTime - p.createTime <= p.life;
    })
    if (!particalList.length) return

    // 遍历粒子,收集属性
    const positionList = []
    const opacityList = []
    const scaleList = []
    const sizeList = []
    particalList.forEach(partical => {
      const {x, y, z} = partical.position
      positionList.push(x, y, z)
      opacityList.push(partical.opacity)
      scaleList.push(partical.scale)
      sizeList.push(partical.size)
    })

    // 粒子属性写入
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionList), 3));
    geometry.setAttribute('a_opacity', new THREE.BufferAttribute(new Float32Array(opacityList), 1));
    geometry.setAttribute('a_scale', new THREE.BufferAttribute(new Float32Array(scaleList), 1));
    geometry.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(sizeList), 1));

  }, 20)
}