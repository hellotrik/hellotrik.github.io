## mini深度框架 trik 已发布
```sh
pip install trik
pip install trik -i https://hellotrik.github.io
cmake .. -G "Visual Studio 14 2015 Win64" -DWITH_GPU=OFF -DWITH_TESTING=OFF -DCMAKE_BUILD_TYPE=Release
```

### set shell edit command=scite.exe
```batch
@echo off
setlocal ENABLEDELAYEDEXPANSION 
reg add HKCR\.c /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.cc /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.cpp /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.hpp /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.py /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.java /v "Content Type" /t REG_SZ /f /d "text/plain"
reg add HKCR\.c /v "PerceivedType" /t REG_SZ /f /d "text"
reg add HKCR\.cc /v "PerceivedType" /t REG_SZ /f /d "text"
reg add HKCR\.cpp /v "PerceivedType" /t REG_SZ /f /d "text"
reg add HKCR\.hpp /v "PerceivedType" /t REG_SZ /f /d "text"
reg add HKCR\.py /v "PerceivedType" /t REG_SZ /f /d "text"
reg add HKCR\.java /v "PerceivedType" /t REG_SZ /f /d "text"

reg add HKCR\Python.file\Shell\edit\command /ve /t REG_EXPAND_SZ /f /d "%%ProgramFiles(x86)%%\AutoIt3\SciTE\SciTE.exe %%1"
for /f %%i in ('reg query HKCR /f edit /e /s /k') do (
	set s=%%i & if not "!s:~,4!"=="搜索结束" (
		set s=!s!\command & set s=!s: =! & reg add !s! /ve /d "%%ProgramFiles(x86)%%\AutoIt3\SciTE\SciTE.exe %%1" /t REG_EXPAND_SZ /f
		REM ~ reg add !s! /ve /d "" /t REG_SZ /f
	)
)
```



### OPENMP
```c

#pragma omp parallel for  
/*
for循环并行化的约束条件

尽管OpenMP可以方便地对for循环进行并行化，但并不是所有的for循环都可以进行并行化。
以下几种情况不能进行并行化：

1. for循环中的循环变量必须是有符号整形。
	例如，for (unsigned int i = 0; i < 10; ++i){}会编译不通过；

2. for循环中比较操作符必须是<, <=, >, >=。
	例如for (int i = 0; i ！= 10; ++i){}会编译不通过；

3. for循环中的第三个表达式，必须是整数的加减，并且加减的值必须是一个循环不变量。
	例如for (int i = 0; i != 10; i = i + 1){}会编译不通过；感觉只能++i; i++; --i; 或i--；

4. 如果for循环中的比较操作为<或<=，那么循环变量只能增加；反之亦然。
	例如for (int i = 0; i != 10; --i)会编译不通过；

5. 循环必须是单入口、单出口，也就是说循环内部不允许能够达到循环以外的跳转语句，exit除外。
	异常的处理也必须在循环体内处理。
	例如：若循环体内的break或goto会跳转到循环体外，那么会编译不通过。
*/
```



[![Image](https://avatars3.githubusercontent.com/u/20605668?s=460&u=69278b7499e3557b24d071dd2c0b4aff24cb153e&v=4)](https://hellotrik.github.io/trik)



### [Catch AISTUDIO with js](https://hellotrik.github.io/trik)
```javascript
x=setInterval(function(){
	if(document.getElementsByClassName("ant-modal")[0]){
		if(document.getElementsByClassName("ant-modal")[0].getElementsByClassName("ant-radio-wrapper")[1].className=="ant-radio-wrapper ant-radio-wrapper-disabled"){
			document.getElementsByClassName("ant-btn")[0].click()
		}else{
			document.getElementsByClassName("ant-modal")[0].getElementsByClassName("ant-radio-wrapper")[1].click();
			document.getElementsByClassName("ant-modal")[0].getElementsByClassName("ant-btn")[0].click();
			clearInterval(x);
		}
	}
	else{
		document.getElementsByClassName("ant-btn")[0].click()
	}
	
},300)
```
### [AISTUDIO Install torch or tf](https://hellotrik.github.io/trik)
```python
#-*- coding:utf-8 -*-
import os,sys
if not os.path.exists('/home/aistudio/pypi'):
	os.mkdir('/home/aistudio/pypi')
if not os.path.exists('/home/aistudio/pypi2'):
    os.mkdir('/home/aistudio/pypi2')
print(
'''
     █████╗ ██╗    
    ██╔══██╗██║    python install.py   ----->自动模式安装tensorflow
    ███████║██║    python install.py 0 ----->自动模式安装tensorflow 强制下载模式
    ██╔══██║██║    python install.py 1 ----->自动模式安装torch
    ██║  ██║██║    python install.py 2 ----->自动模式安装torch 强制下载模式
    ╚═╝  ╚═╝╚═╝    
    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
'''
)


cmd=[
    'wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/linux-64/cudatoolkit-9.0-h13b8566_0.conda -P /home/aistudio/pypi2/',
    'python3.6 -m pip download tensorflow-gpu==1.12.0 keras==2.1.5 -i https://pypi.tuna.tsinghua.edu.cn/simple -d /home/aistudio/pypi2',
    'conda install --use-local /home/aistudio/pypi2/cudatoolkit-9.0-h13b8566_0.conda -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/',
    'python3.6 -m pip install tensorflow-gpu==1.12.0 keras==2.1.5 --no-index -f /home/aistudio/pypi2']

cmd2=['pip download bs4 lxml xlwt xlrd seaborn -i https://pypi.tuna.tsinghua.edu.cn/simple -d /home/aistudio/pypi',
      'pip download torch==1.4.0+cu92 torchvision==0.5.0+cu92 -f https://download.pytorch.org/whl/torch_stable.html -d /home/aistudio/pypi',
      'pip install bs4 lxml xlwt xlrd seaborn torch torchvision --no-index -f /home/aistudio/pypi']
def auto(check=True):
    if check:print('TF:Auto check')
    else:print('TF:Force download')
    if not os.path.exists('/home/aistudio/pypi2/cudatoolkit-9.0-h13b8566_0.conda'):os.system(cmd[0])
    if check:
        if not os.path.exists('/home/aistudio/pypi2/tensorflow_gpu-1.12.0-cp36-cp36m-manylinux1_x86_64.whl'):os.system(cmd[1])
    else:os.system(cmd[1])
    if not 'cudatoolkit' in os.popen('conda list cudatoolkit').read():os.system(cmd[2])
    if os.popen('python3.6 -m pip show keras').read()=='':os.system(cmd[3])
    print('TF已就绪于python3.6,请在命令行输入 python3.6 进行测试')
def auto2(check=True):
    if check:
        print('Torch:auto check')
        if not 'lxml' in ' '.join(os.listdir('/home/aistudio/pypi/')):
                os.system(cmd2[0])
        if not 'torch' in ' '.join(os.listdir('/home/aistudio/pypi/')):
                os.system(cmd2[1])
    else:
        print('Torch:force download')
        os.system(cmd2[0]);os.system(cmd2[1])
    if os.popen('pip show torch').read()=='' and 'torch' in ' '.join(os.listdir('/home/aistudio/pypi/')):
            os.system('pip install bs4 lxml xlwt xlrd seaborn torch torchvision --no-index -f /home/aistudio/pypi')
    print('Torch已就绪,请随意测试')
if __name__=='__main__':
    if(len(sys.argv)<2):
        auto()
    elif sys.argv[1] in ['0','1','2']:
        if sys.argv[1]=='0':
            auto(False)
        if sys.argv[1]=='1':
            auto2()
        if sys.argv[1]=='2':
            auto2(False)
```

### Friend Links

[![Image](https://mrq-lhr.github.io/profile/6.jpg)](https://ChenAi007.github.io)Ash尘埃

<!--
```markdown
# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```
For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/mrq-lhr/mrq-lhr.github.io/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
-->
