"""Replay the actual renderer draw capture in native EGL/GLES. Not browser E2E."""
import ctypes as C,json,sys
from pathlib import Path
from PIL import Image
P=C.c_void_p;I=C.c_int;U=C.c_uint;F=C.c_float
E=C.CDLL('libEGL.so.1');E.eglGetProcAddress.argtypes=[C.c_char_p];E.eglGetProcAddress.restype=P
def gl(name,ret,*args):return C.CFUNCTYPE(ret,*args)(E.eglGetProcAddress(name.encode()))
data=json.loads(Path(sys.argv[1]).read_text());width=data['width'];height=data['height']
display=C.CFUNCTYPE(P,U,P,C.POINTER(I))(E.eglGetProcAddress(b'eglGetPlatformDisplayEXT'))(0x31DD,None,None)
E.eglInitialize.argtypes=[P,C.POINTER(I),C.POINTER(I)];E.eglInitialize.restype=U
assert E.eglInitialize(display,None,None),'EGL unavailable'
E.eglBindAPI.argtypes=[U];E.eglBindAPI.restype=U;assert E.eglBindAPI(0x30A0)
cfg=P();count=I();E.eglChooseConfig.argtypes=[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)];E.eglChooseConfig.restype=U
attrs=(I*15)(0x3033,1,0x3040,4,0x3024,8,0x3023,8,0x3022,8,0x3025,24,0x3038,0,0)
assert E.eglChooseConfig(display,attrs,C.byref(cfg),1,C.byref(count)) and count.value
E.eglCreatePbufferSurface.argtypes=[P,P,C.POINTER(I)];E.eglCreatePbufferSurface.restype=P
surface=E.eglCreatePbufferSurface(display,cfg,(I*5)(0x3057,width,0x3056,height,0x3038))
E.eglCreateContext.argtypes=[P,P,P,C.POINTER(I)];E.eglCreateContext.restype=P
context=E.eglCreateContext(display,cfg,None,(I*3)(0x3098,2,0x3038))
E.eglMakeCurrent.argtypes=[P,P,P,P];E.eglMakeCurrent.restype=U;assert E.eglMakeCurrent(display,surface,surface,context)
program=gl('glCreateProgram',U)()
for shader in data['shaders']:
    handle=gl('glCreateShader',U,U)(shader['type']);raw=shader['source'].encode();text=C.c_char_p(raw);length=I(len(raw))
    gl('glShaderSource',None,U,I,C.POINTER(C.c_char_p),C.POINTER(I))(handle,1,C.byref(text),C.byref(length));gl('glCompileShader',None,U)(handle)
    status=I();gl('glGetShaderiv',None,U,U,C.POINTER(I))(handle,0x8B81,C.byref(status))
    if not status.value:
        log=C.create_string_buffer(8192);gl('glGetShaderInfoLog',None,U,I,C.POINTER(I),C.c_char_p)(handle,8192,None,log);raise RuntimeError(log.value.decode())
    gl('glAttachShader',None,U,U)(program,handle)
gl('glLinkProgram',None,U)(program);status=I();gl('glGetProgramiv',None,U,U,C.POINTER(I))(program,0x8B82,C.byref(status))
if not status.value:
    log=C.create_string_buffer(8192);gl('glGetProgramInfoLog',None,U,I,C.POINTER(I),C.c_char_p)(program,8192,None,log);raise RuntimeError(log.value.decode())
gl('glUseProgram',None,U)(program);gl('glEnable',None,U)(0x0B71);gl('glViewport',None,I,I,I,I)(0,0,width,height)
gl('glClearColor',None,F,F,F,F)(*data['background']);gl('glClear',None,U)(0x4000|0x0100)
buffers={}
for b in data['buffers']:
    handle=U();gl('glGenBuffers',None,I,C.POINTER(U))(1,C.byref(handle));buffers[b['id']]=handle.value
    array=(F*len(b['vertices']))(*b['vertices']);gl('glBindBuffer',None,U,U)(0x8892,handle.value)
    gl('glBufferData',None,U,C.c_size_t,P,U)(0x8892,C.sizeof(array),C.cast(array,P),0x88E4)
textures={}
for t in data['textures']:
    handle=U();gl('glGenTextures',None,I,C.POINTER(U))(1,C.byref(handle));textures[t['id']]=handle.value
    gl('glBindTexture',None,U,U)(0x0DE1,handle.value)
    if t.get('image'):
        image=Image.open((Path(__file__).resolve().parents[1]/'public')/t['image'].lstrip('/')).convert('RGBA').transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        tw,th=image.size;raw=image.tobytes()
    else:tw=th=1;raw=bytes(t.get('color',[255,255,255,255]))
    pixels=C.create_string_buffer(raw);gl('glTexImage2D',None,U,I,I,I,I,I,U,U,P)(0x0DE1,0,0x1908,tw,th,0,0x1908,0x1401,C.cast(pixels,P))
    for name,value in [(0x2801,0x2601),(0x2800,0x2601),(0x2802,0x812F),(0x2803,0x812F)]:gl('glTexParameteri',None,U,U,I)(0x0DE1,name,value)
for call in data['calls']:
    gl('glBindBuffer',None,U,U)(0x8892,buffers[call['buffer']])
    for name,size,offset in [('aPosition',3,0),('aNormal',3,12),('aColor',4,24),('aUV',2,40)]:
        loc=gl('glGetAttribLocation',I,U,C.c_char_p)(program,name.encode())
        if loc>=0:gl('glEnableVertexAttribArray',None,U)(loc);gl('glVertexAttribPointer',None,U,I,U,U,I,P)(loc,size,0x1406,0,48,P(offset))
    for name,value in call['uniforms'].items():
        loc=gl('glGetUniformLocation',I,U,C.c_char_p)(program,name.encode())
        if loc<0:continue
        if isinstance(value,list):
            array=(F*len(value))(*value);gl('glUniform'+str(len(value))+'fv',None,I,I,C.POINTER(F))(loc,1,array)
        elif name.endswith('Texture'):gl('glUniform1i',None,I,I)(loc,int(value))
        else:gl('glUniform1f',None,I,F)(loc,value)
    for unit,texture in call['textures'].items():
        gl('glActiveTexture',None,U)(0x84C0+int(unit));gl('glBindTexture',None,U,U)(0x0DE1,textures[texture])
    gl('glDrawArrays',None,U,I,I)(0x0004,0,call['count'])
assert gl('glGetError',U)()==0,'Native GLES error'
pixels=C.create_string_buffer(width*height*4);gl('glReadPixels',None,I,I,I,I,U,U,P)(0,0,width,height,0x1908,0x1401,C.cast(pixels,P))
image=Image.frombytes('RGBA',(width,height),pixels.raw).transpose(Image.Transpose.FLIP_TOP_BOTTOM).convert('RGB');image.save(sys.argv[2])
print('PASS: actual scene draw commands/shaders/textures rendered through native EGL/GLES. Not browser E2E.',sys.argv[2])
