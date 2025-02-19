import {
    getRGB,
    rgbToString,
}
from './svglite';

export function clone(obj) {
    var copy, i, attr, len;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    return obj;
}


// Calculate style
export function styleNormCalc(styleNormFrom, styleNormTo, progress) {
    var i, styleNorm = {};
    for (i in styleNormFrom) {
        switch (i) {
        case 'strokeLinecap':
        case 'strokeLinejoin':
            styleNorm[i] = clone(styleNormFrom[i]);
            break;
        case 'fill':
        case 'stroke':
            styleNorm[i] = clone(styleNormFrom[i]);
            styleNorm[i].r = styleNormFrom[i].r + (styleNormTo[i].r - styleNormFrom[i].r) * progress;
            styleNorm[i].g = styleNormFrom[i].g + (styleNormTo[i].g - styleNormFrom[i].g) * progress;
            styleNorm[i].b = styleNormFrom[i].b + (styleNormTo[i].b - styleNormFrom[i].b) * progress;
            styleNorm[i].opacity = styleNormFrom[i].opacity + (styleNormTo[i].opacity - styleNormFrom[i].opacity) * progress;
            break;
        case 'opacity':
        case 'fillOpacity':
        case 'strokeOpacity':
        case 'strokeWidth':
            styleNorm[i] = styleNormFrom[i] + (styleNormTo[i] - styleNormFrom[i]) * progress;
            break;
        }
    }
    return styleNorm;
}

export function styleNormToString(styleNorm) {
    var i;
    var style = {};
    for (i in styleNorm) {
        switch (i) {
        case 'fill':
        case 'stroke':
            style[i] = rgbToString(styleNorm[i]);
            break;
        case 'opacity':
        case 'fillOpacity':
        case 'strokeOpacity':
        case 'strokeWidth':
        case 'strokeLinecap':
        case 'strokeLinejoin':
            style[i] = styleNorm[i];
            break;
        }
    }
    return style;
}

export function styleToNorm(styleFrom, styleTo) {
    var styleNorm = [{}, {}];
    var i;
    for (i in styleFrom) {
        switch (i) {
        case 'fill':
        case 'stroke':
            styleNorm[0][i] = getRGB(styleFrom[i]);
            if (styleTo[i] === undefined) {
                styleNorm[1][i] = getRGB(styleFrom[i]);
                styleNorm[1][i].opacity = 0;
            }
            break;
        case 'opacity':
        case 'fillOpacity':
        case 'strokeOpacity':
        case 'strokeWidth':
            styleNorm[0][i] = styleFrom[i];
            if (styleTo[i] === undefined) {
                styleNorm[1][i] = 1;
            }
            break;
        case 'strokeLinecap':
        case 'strokeLinejoin':
            styleNorm[0][i] = styleFrom[i];
            if (styleTo[i] === undefined) {
                styleNorm[1][i] = styleFrom[i];
            }
            break;
        }
    }
    for (i in styleTo) {
        switch (i) {
        case 'fill':
        case 'stroke':
            styleNorm[1][i] = getRGB(styleTo[i]);
            if (styleFrom[i] === undefined) {
                styleNorm[0][i] = getRGB(styleTo[i]);
                styleNorm[0][i].opacity = 0;
            }
            break;
        case 'opacity':
        case 'fillOpacity':
        case 'strokeOpacity':
        case 'strokeWidth':
            styleNorm[1][i] = styleTo[i];
            if (styleFrom[i] === undefined) {
                styleNorm[0][i] = 1;
            }
            break;
        case 'strokeLinecap':
        case 'strokeLinejoin':
            styleNorm[1][i] = styleTo[i];
            if (styleFrom[i] === undefined) {
                styleNorm[0][i] = styleTo[i];
            }
            break;
        }
    }
    return styleNorm;
}

// Calculate transform progress
export function transCalc(transFrom, transTo, progress) {
    var res = {};
    var i, j;
    for (i in transFrom) {
        switch (i) {
        case 'rotate':
            res[i] = [0, 0, 0];
            for ( j = 0; j < 3; j++) {
                res[i][j] = transFrom[i][j] + (transTo[i][j] - transFrom[i][j]) * progress;
            }
            break;
        }
    }
    return res;
}

export function trans2string(trans) {
    var res = '';
    if (!!trans.rotate) {
        res += 'rotate(' + trans.rotate.join(' ') + ')';
    }
    return res;
}

// Calculate curve progress
export function curveCalc(curveFrom, curveTo, progress) {
    var curve = [];
    var i = 0, j;
    var len1 = curveFrom.length, len2;
    for (; i < len1; i++) {
        curve.push([curveFrom[i][0]]);
        for (j = 1, len2 = curveFrom[i].length; j < len2; j++) {
            curve[i].push(curveFrom[i][j] + (curveTo[i][j] - curveFrom[i][j]) * progress);
        }
    }
    return curve;
}
