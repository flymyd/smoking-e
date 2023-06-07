class Partical {
  constructor(range = 10, center = {x: 0, y: 0, z: 0}) {
    this.range = range; // 粒子的分布半径
    this.center = center // 粒子的分布中心
    this.life = 10000; // 粒子的存活时间，毫秒
    this.createTime = Date.now(); // 粒子创建时间
    this.updateTime = Date.now(); // 上次更新时间
    this.size = 200 // 粒子大小
    // 粒子透明度，及系数
    this.opacity = 0.6
    // 粒子放大量，及放大系数
    this.scaleFactor = 2
    this.scale = 1 + this.scaleFactor * (this.updateTime - this.createTime) / this.life // 初始1，到达生命周期时为3
    // 粒子位置
    this.position = {
      x: Math.random() * 2 * this.range + this.center.x - this.range,
      y: this.center.y,
      z: Math.random() * 2 * this.range + this.center.z - this.range,
    }
    // 水平方向的扩散
    let speedAround = Math.random() * 40
    if (speedAround < 20) speedAround -= 50
    if (speedAround > 20) speedAround += 10
    // 粒子的扩散速度
    this.speed = {
      x: speedAround,
      y: Math.random() * 100 + 100,
      z: speedAround,
    }
  }
  // 更新粒子
  update() {
    const now = Date.now()
    const time = now - this.updateTime
    // 更新位置
    this.position.x += this.speed.x * time / 1000
    this.position.y += this.speed.y * time / 1000
    this.position.z += this.speed.z * time / 1000
    // 计算粒子透明度
    this.opacity = 1 - (now - this.createTime) / this.life
    this.opacity *= this.opacityFactor
    if (this.opacity < 0) this.opacity = 0
    // 计算放大量
    this.scale = 1 + this.scaleFactor * (now - this.createTime) / this.life
    if (this.scale > 1 + this.scaleFactor) this.scale = 1 + this.scaleFactor
    // 重置更新时间
    this.updateTime = now
  }
}

export default Partical;