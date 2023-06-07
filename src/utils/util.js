export function isIOS(){
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS;
}
export const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));