function smokeEffect() {
    function e() {
        this.id = -1,
            this.x = 0,
            this.y = 0,
            this.dx = 0,
            this.dy = 0,
            this.down = !1,
            this.moved = !1,
            this.color = [30, 0, 300]
    }
    function t(e, t) {
        var i = h.createShader(e);
        if (h.shaderSource(i, t),
            h.compileShader(i),
            !h.getShaderParameter(i, h.COMPILE_STATUS))
            throw h.getShaderInfoLog(i);
        return i
    }
    function i() {
        E = h.drawingBufferWidth >> c.TEXTURE_DOWNSAMPLE,
            A = h.drawingBufferHeight >> c.TEXTURE_DOWNSAMPLE;
        var e = f.internalFormat
            , t = f.internalFormatRG
            , i = f.formatRG
            , o = f.texType;
        D = r(0, E, A, e, h.RGBA, o, m ? h.LINEAR : h.NEAREST),
            R = r(2, E, A, t, i, o, m ? h.LINEAR : h.NEAREST),
            O = n(4, E, A, t, i, o, h.NEAREST),
            L = n(5, E, A, t, i, o, h.NEAREST),
            M = r(6, E, A, t, i, o, h.NEAREST)
    }
    function n(e, t, i, n, r, o, s) {
        h.activeTexture(h.TEXTURE0 + e);
        var a = h.createTexture();
        h.bindTexture(h.TEXTURE_2D, a),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, s),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, s),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE),
            h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE),
            h.texImage2D(h.TEXTURE_2D, 0, n, t, i, 0, r, o, null);
        var l = h.createFramebuffer();
        return h.bindFramebuffer(h.FRAMEBUFFER, l),
            h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0, h.TEXTURE_2D, a, 0),
            h.viewport(0, 0, t, i),
            h.clear(h.COLOR_BUFFER_BIT),
            [a, l, e]
    }
    function r(e, t, i, r, o, s, a) {
        var l = n(e, t, i, r, o, s, a)
            , c = n(e + 1, t, i, r, o, s, a);
        return {
            get first() {
                return l
            },
            get second() {
                return c
            },
            swap: function() {
                var e = l;
                l = c,
                    c = e
            }
        }
    }
    function o() {
        a();
        var e = Math.min((Date.now() - W) / 1e3, .016);
        if (W = Date.now(),
            h.viewport(0, 0, E, A),
        d.length > 0)
            for (var t = 0; t < d.pop(); t++) {
                var i = [10 * Math.random(), 10 * Math.random(), 10 * Math.random()]
                    , n = l.width * Math.random()
                    , r = l.height * Math.random()
                    , p = 1e3 * (Math.random() - .5)
                    , f = 1e3 * (Math.random() - .5);
                s(n, r, p, f, i)
            }
        F.bind(),
            h.uniform2f(F.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(F.uniforms.uVelocity, R.first[2]),
            h.uniform1i(F.uniforms.uSource, R.first[2]),
            h.uniform1f(F.uniforms.dt, e),
            h.uniform1f(F.uniforms.dissipation, c.VELOCITY_DISSIPATION),
            X(R.second[1]),
            R.swap(),
            h.uniform1i(F.uniforms.uVelocity, R.first[2]),
            h.uniform1i(F.uniforms.uSource, D.first[2]),
            h.uniform1f(F.uniforms.dissipation, c.DENSITY_DISSIPATION),
            X(D.second[1]),
            D.swap();
        for (var m = 0, g = u.length; m < g; m++) {
            var v = u[m];
            v.moved && (s(v.x, v.y, v.dx, v.dy, v.color),
                v.moved = !1)
        }
        H.bind(),
            h.uniform2f(H.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(H.uniforms.uVelocity, R.first[2]),
            X(L[1]),
            j.bind(),
            h.uniform2f(j.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(j.uniforms.uVelocity, R.first[2]),
            h.uniform1i(j.uniforms.uCurl, L[2]),
            h.uniform1f(j.uniforms.curl, c.CURL),
            h.uniform1f(j.uniforms.dt, e),
            X(R.second[1]),
            R.swap(),
            I.bind(),
            h.uniform2f(I.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(I.uniforms.uVelocity, R.first[2]),
            X(O[1]),
            $.bind();
        var y = M.first[2];
        h.activeTexture(h.TEXTURE0 + y),
            h.bindTexture(h.TEXTURE_2D, M.first[0]),
            h.uniform1i($.uniforms.uTexture, y),
            h.uniform1f($.uniforms.value, c.PRESSURE_DISSIPATION),
            X(M.second[1]),
            M.swap(),
            B.bind(),
            h.uniform2f(B.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(B.uniforms.uDivergence, O[2]),
            y = M.first[2],
            h.activeTexture(h.TEXTURE0 + y);
        for (var _ = 0; _ < c.PRESSURE_ITERATIONS; _++)
            h.bindTexture(h.TEXTURE_2D, M.first[0]),
                h.uniform1i(B.uniforms.uPressure, y),
                X(M.second[1]),
                M.swap();
        q.bind(),
            h.uniform2f(q.uniforms.texelSize, 1 / E, 1 / A),
            h.uniform1i(q.uniforms.uPressure, M.first[2]),
            h.uniform1i(q.uniforms.uVelocity, R.first[2]),
            X(R.second[1]),
            R.swap(),
            h.viewport(0, 0, h.drawingBufferWidth, h.drawingBufferHeight),
            N.bind(),
            h.uniform1i(N.uniforms.uTexture, D.first[2]),
            X(null),
            requestAnimationFrame(o)
    }
    function s(e, t, i, n, r) {
        z.bind(),
            h.uniform1i(z.uniforms.uTarget, R.first[2]),
            h.uniform1f(z.uniforms.aspectRatio, l.width / l.height),
            h.uniform2f(z.uniforms.point, e / l.width, 1 - t / l.height),
            h.uniform3f(z.uniforms.color, i, -n, 1),
            h.uniform1f(z.uniforms.radius, c.SPLAT_RADIUS),
            X(R.second[1]),
            R.swap(),
            h.uniform1i(z.uniforms.uTarget, D.first[2]),
            h.uniform3f(z.uniforms.color, .3 * r[0], .3 * r[1], .3 * r[2]),
            X(D.second[1]),
            D.swap()
    }
    function a() {
        (l.width !== l.clientWidth || l.height !== l.clientHeight) && (l.width = l.clientWidth,
            l.height = l.clientHeight,
            i())
    }
    var l = document.getElementById("smoke_canvas");
    l.width = l.clientWidth,
        l.height = l.clientHeight;
    var c = {
        TEXTURE_DOWNSAMPLE: 1,
        DENSITY_DISSIPATION: .98,
        VELOCITY_DISSIPATION: .99,
        PRESSURE_DISSIPATION: .8,
        PRESSURE_ITERATIONS: 25,
        CURL: 30,
        SPLAT_RADIUS: .005
    }
        , u = []
        , d = []
        , p = function(e) {
        var t = {
            alpha: !1,
            depth: !1,
            stencil: !1,
            antialias: !1
        }
            , i = e.getContext("webgl2", t)
            , n = !!i;
        n || (i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t));
        var r = i.getExtension("OES_texture_half_float")
            , o = i.getExtension("OES_texture_half_float_linear");
        return n && (i.getExtension("EXT_color_buffer_float"),
            o = i.getExtension("OES_texture_float_linear")),
            i.clearColor(0, 0, 0, 1),
            {
                gl: i,
                ext: {
                    internalFormat: n ? i.RGBA16F : i.RGBA,
                    internalFormatRG: n ? i.RG16F : i.RGBA,
                    formatRG: n ? i.RG : i.RGBA,
                    texType: n ? i.HALF_FLOAT : r.HALF_FLOAT_OES
                },
                support_linear_float: o
            }
    }(l)
        , h = p.gl
        , f = p.ext
        , m = p.support_linear_float;
    u.push(new e);
    var g = function() {
        function e(t, i) {
            if (!(this instanceof e))
                throw new TypeError("Cannot call a class as a function");
            if (this.uniforms = {},
                this.program = h.createProgram(),
                h.attachShader(this.program, t),
                h.attachShader(this.program, i),
                h.linkProgram(this.program),
                !h.getProgramParameter(this.program, h.LINK_STATUS))
                throw h.getProgramInfoLog(this.program);
            for (var n = h.getProgramParameter(this.program, h.ACTIVE_UNIFORMS), r = 0; r < n; r++) {
                var o = h.getActiveUniform(this.program, r).name;
                this.uniforms[o] = h.getUniformLocation(this.program, o)
            }
        }
        return e.prototype.bind = function() {
            h.useProgram(this.program)
        }
            ,
            e
    }()
        , v = t(h.VERTEX_SHADER, "precision highp float; precision mediump sampler2D; attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize; void main () {     vUv = aPosition * 0.5 + 0.5;     vL = vUv - vec2(texelSize.x, 0.0);     vR = vUv + vec2(texelSize.x, 0.0);     vT = vUv + vec2(0.0, texelSize.y);     vB = vUv - vec2(0.0, texelSize.y);     gl_Position = vec4(aPosition, 0.0, 1.0); }")
        , y = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () {     gl_FragColor = value * texture2D(uTexture, vUv); }")
        , _ = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; void main () {     gl_FragColor = texture2D(uTexture, vUv); }")
        , b = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main () {     vec2 p = vUv - point.xy;     p.x *= aspectRatio;     vec3 splat = exp(-dot(p, p) / radius) * color;     vec3 base = texture2D(uTarget, vUv).xyz;     gl_FragColor = vec4(base + splat, 1.0); }")
        , w = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; vec4 bilerp (in sampler2D sam, in vec2 p) {     vec4 st;     st.xy = floor(p - 0.5) + 0.5;     st.zw = st.xy + 1.0;     vec4 uv = st * texelSize.xyxy;     vec4 a = texture2D(sam, uv.xy);     vec4 b = texture2D(sam, uv.zy);     vec4 c = texture2D(sam, uv.xw);     vec4 d = texture2D(sam, uv.zw);     vec2 f = p - st.xy;     return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); } void main () {     vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;     gl_FragColor = dissipation * bilerp(uSource, coord);     gl_FragColor.a = 1.0; }")
        , x = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; void main () {     vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;     gl_FragColor = dissipation * texture2D(uSource, coord); }")
        , T = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; vec2 sampleVelocity (in vec2 uv) {     vec2 multiplier = vec2(1.0, 1.0);     if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }     if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }     if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }     if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }     return multiplier * texture2D(uVelocity, uv).xy; } void main () {     float L = sampleVelocity(vL).x;     float R = sampleVelocity(vR).x;     float T = sampleVelocity(vT).y;     float B = sampleVelocity(vB).y;     float div = 0.5 * (R - L + T - B);     gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }")
        , S = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main () {     float L = texture2D(uVelocity, vL).y;     float R = texture2D(uVelocity, vR).y;     float T = texture2D(uVelocity, vT).x;     float B = texture2D(uVelocity, vB).x;     float vorticity = R - L - T + B;     gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); }")
        , k = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main () {     float L = texture2D(uCurl, vL).y;     float R = texture2D(uCurl, vR).y;     float T = texture2D(uCurl, vT).x;     float B = texture2D(uCurl, vB).x;     float C = texture2D(uCurl, vUv).x;     vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));     force *= 1.0 / length(force + 0.00001) * curl * C;     vec2 vel = texture2D(uVelocity, vUv).xy;     gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); }")
        , C = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     float C = texture2D(uPressure, vUv).x;     float divergence = texture2D(uDivergence, vUv).x;     float pressure = (L + R + B + T - divergence) * 0.25;     gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }")
        , P = t(h.FRAGMENT_SHADER, "precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     vec2 velocity = texture2D(uVelocity, vUv).xy;     velocity.xy -= vec2(R - L, T - B);     gl_FragColor = vec4(velocity, 0.0, 1.0); }")
        , E = void 0
        , A = void 0
        , D = void 0
        , R = void 0
        , O = void 0
        , L = void 0
        , M = void 0;
    i();
    var $ = new g(v,y)
        , N = new g(v,_)
        , z = new g(v,b)
        , F = new g(v,m ? x : w)
        , I = new g(v,T)
        , H = new g(v,S)
        , j = new g(v,k)
        , B = new g(v,C)
        , q = new g(v,P)
        , X = function() {
        return h.bindBuffer(h.ARRAY_BUFFER, h.createBuffer()),
            h.bufferData(h.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), h.STATIC_DRAW),
            h.bindBuffer(h.ELEMENT_ARRAY_BUFFER, h.createBuffer()),
            h.bufferData(h.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), h.STATIC_DRAW),
            h.vertexAttribPointer(0, 2, h.FLOAT, !1, 0, 0),
            h.enableVertexAttribArray(0),
            function(e) {
                h.bindFramebuffer(h.FRAMEBUFFER, e),
                    h.drawElements(h.TRIANGLES, 6, h.UNSIGNED_SHORT, 0)
            }
    }()
        , W = Date.now();
    o();
    var U = 0
        , Y = function(e) {
        return [parseInt(e.substring(1, 3), 16) / 255, parseInt(e.substring(3, 5), 16) / 255, parseInt(e.substring(5, 7), 16) / 255]
    }("#5d5d5d");
    l.addEventListener("mousemove", function(e) {
        U++,
        U > 25 && (colorArr = [Math.random() + .2, Math.random() + .2, Math.random() + .2],
            U = 0),
            u[0].down = !0,
            u[0].color = Y,
            u[0].moved = u[0].down,
            u[0].dx = 10 * (e.offsetX - u[0].x),
            u[0].dy = 10 * (e.offsetY - u[0].y),
            u[0].x = e.offsetX,
            u[0].y = e.offsetY
    }),
        l.addEventListener("touchmove", function(t) {
            t.preventDefault();
            var i = t.targetTouches;
            ++U > 25 && (colorArr = [Math.random() + .2, Math.random() + .2, Math.random() + .2],
                U = 0);
            for (var n = 0, r = i.length; n < r; n++) {
                n >= u.length && u.push(new e),
                    u[n].id = i[n].identifier,
                    u[n].down = !0,
                    u[n].x = i[n].pageX,
                    u[n].y = i[n].pageY,
                    u[n].color = Y;
                var o = u[n];
                o.moved = o.down,
                    o.dx = 10 * (i[n].pageX - o.x),
                    o.dy = 10 * (i[n].pageY - o.y),
                    o.x = i[n].pageX,
                    o.y = i[n].pageY
            }
        }, !1)
}
