"use strict";var rgb2Hsb=require("./util").rgb2Hsb,hsb2Rgb=require("./util").hsb2Rgb;module.exports={normal:function(n,r){return r.map(function(n){return n})},multiply:function(t,n){return n.map(function(n,r){return n*t[r]/255})},screen:function(t,n){return n.map(function(n,r){return 255-(255-n)*(255-t[r])/255})},difference:function(t,n){return n.map(function(n,r){return Math.abs(n-t[r])})},subtract:function(t,n){return n.map(function(n,r){return t[r]-n})},overlay:function(t,u){return u.map(function(n,r){return u[r]<=128?n*t[r]/128:255-(255-n)*(255-t[r])/128})},darken:function(t,n){return n.map(function(n,r){return Math.min(n,t[r])})},lighten:function(t,n){return n.map(function(n,r){return Math.max(n,t[r])})},exclusion:function(t,n){return n.map(function(n,r){return n+t[r]-n*t[r]/128})},colorDodge:function(t,n){return n.map(function(n,r){return t[r]+n*t[r]/(255-t[r])})},colorBurn:function(t,n){return n.map(function(n,r){return 255*(t[r]+n-255)/n})},hardLight:function(t,n){return n.map(function(n,r){return n<=128?n*t[r]/128:255-(255-n)*(255-t[r])/128})},softLight:function(t,n){return n.map(function(n,r){return n<=128?t[r]+(2*n-255)*(t[r]-t[r]*t[r]/255)/255:t[r]+(2*n-255)*(255*Math.sqrt(t[r]/255)-t[r])/255})},hue:function(n,r){var t=rgb2Hsb(n),u=[rgb2Hsb(r)[0],t[1],t[2]];return hsb2Rgb(u)},saturation:function(n,r){var t=rgb2Hsb(n),u=rgb2Hsb(r),i=[t[0],u[1],t[2]];return hsb2Rgb(i)},color:function(n,r){var t=rgb2Hsb(n),u=rgb2Hsb(r),i=[u[0],u[1],t[2]];return hsb2Rgb(i)},luminosity:function(n,r){var t=rgb2Hsb(n),u=rgb2Hsb(r),i=[t[0],t[1],u[2]];return hsb2Rgb(i)},dissolve:function(n,r){return 50<Math.floor(100*Math.random())?n:r},linearBurn:function(t,n){return n.map(function(n,r){return t[r]+n-255})},darkerColor:function(n,r){return n[0]+n[1]+n[2]+n[3]<r[0]+r[1]+r[2]+r[3]?n:r},linearDodge:function(t,n){return n.map(function(n,r){return Math.min(t[r]+n,255)})},lighterColor:function(n,r){return n[0]+n[1]+n[2]+n[3]>r[0]+r[1]+r[2]+r[3]?n:r},vividLight:function(t,n){return n.map(function(n,r){return n<=128?255-(255-t[r])/(2*n)*255:t[r]/(2*(255-n))*255})},linearLight:function(t,n){return n.map(function(n,r){return Math.min(2*n+t[r]-255,255)})},pinLight:function(t,n){return n.map(function(n,r){return t[r]<2*n-255?2*n-255:2*n-255<t[r]<2*n?t[r]:t[r]>2*n?2*n:void 0})},hardMix:function(t,n){return n.map(function(n,r){return n<255-t[r]?0:255})},divide:function(t,n){return n.map(function(n,r){return t[r]/n*255})}};