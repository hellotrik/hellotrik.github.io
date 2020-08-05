[![Image](https://avatars3.githubusercontent.com/u/20605668?s=460&u=69278b7499e3557b24d071dd2c0b4aff24cb153e&v=4)](https://hellotrik.github.io/clock)
## mini深度框架 trik 已发布
```sh
pip install trik
pip install trik -i https://hellotrik.github.io
cmake .. -G "Visual Studio 14 2015 Win64" -DWITH_GPU=OFF -DWITH_TESTING=OFF -DCMAKE_BUILD_TYPE=Release
```

###设置磁盘id
```
请严格按照如下流程：

1 以管理员打开 硬盘安装助手

2 选择苹果Mac系统镜像 （cdr格式的）

3 直接选择要写入的盘，不要点击右边的方框中的勾选

（此时就可以写入了，虽然最后还是显示

Change partition type to AF: not a HFS partition
Load boot1h: not a HFS partition
Load startupfile: not a HFS partition
All done, have fun!

，不要担心）

如果在写入之前改了分区类型为AF，硬盘安装助手就找不到安装盘分区了。所以应当在写入完成后再更改分区类型。


如何更改分区类型：

使用分区助手，更改分区类型按钮是灰色。此时可以这么做：

依次打开，开始菜单－附件－命令提示符，输入 diskpart命令，回车，在新弹出窗口中依次输入以下命令： 

list disk

set disk X      (X是硬盘号码，如果只有一个 则是 0 ) 
select disk X 
list part 
查看分区序号，比如说是第2个分区，依次输入以下命令： 
sel part 2
set id＝af 

如何使用set id=af识别，使用 set id=48465300-0000-11AA-AA11-00306543ECAC override设置。
```
### 设置ip
```
@echo off
REM 静态
netsh interface ip set address name="本地连接" source = static addr = 10.3.144.171 mask=255.255.255.0
netsh interface ip set address name="本地连接" gateway = 10.3.144.1 gwmetric =0
netsh interface ip set dns name="本地连接" source = static addr = 202.99.160.68 register=PRIMARY
netsh interface ip add dns name="本地连接" addr = 202.99.160.68 index=2

REM 动态
netsh interface IP set address name="本地连接" source=dhcp
netsh interface ip set dns  name="本地连接" source=dhcp
```


### 自动挂载vhd
```
@echo off 
echo select vdisk file="c:\swsetup\s.VHD" >vhdsel 
echo attach vdisk>>vhdsel 
echo list disk>>vhdsel 
diskpart /s vhdsel 
del /f /q vhdsel 
exit
```

### 一键清理
```batch
@echo off
echo 正在清理系统垃圾文件，请稍等......
del /f /s /q %systemdrive%\*.tmp
del /f /s /q %systemdrive%\*._mp
del /f /s /q %systemdrive%\*.gid
del /f /s /q %systemdrive%\*.chk
del /f /s /q %systemdrive%\*.old
del /f /s /q %systemdrive%\recycled\*.*
del /f /s /q %windir%\*.bak
del /f /s /q %windir%\prefetch\*.*
rd /s /q %windir%\temp & md %windir%\temp
del /f /q %userprofile%\cookies\*.*
del /f /q %userprofile%\recent\*.*
del /f /s /q "%userprofile%\Local Settings\Temporary Internet Files\*.*"
del /f /s /q "%userprofile%\Local Settings\Temp\*.*"
del /f /s /q "%userprofile%\recent\*.*"
echo 清理系统垃圾完成！
echo. & pause 

```

### 清除图报表缓存 去除边缘停靠
```batch
@echo off
reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Wallpapers\Images /va /f>nul
reg add "HKCU\Control Panel\Desktop" /v WindowArrangementActive /t REG_SZ /d 0 /f>nul
echo Y|del C:\Users\Administrator\AppData\Local\Temp\*.* >nul
taskkill /f /im explorer.exe
attrib -h -s -r "%userprofile%\AppData\Local\IconCache.db"
del /f "%userprofile%\AppData\Local\IconCache.db"
attrib /s /d -h -s -r "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\*"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_32.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_96.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_102.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_256.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_1024.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_idx.db"
del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_sr.db"

echo y|reg delete "HKEY_CLASSES_ROOT\Local Settings\Software\Microsoft\Windows\CurrentVersion\TrayNotify" /v IconStreams
echo y|reg delete "HKEY_CLASSES_ROOT\Local Settings\Software\Microsoft\Windows\CurrentVersion\TrayNotify" /v PastIconsStream
start explorer
@pause
```


### 关闭windows默认共享
```batch
@echo off
@color 74
:main
cls
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Internet Explorer\MAIN" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f >nul
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Internet Explorer\MAIN" /v Default_Page_URL /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKLM\SOFTWARE\Microsoft\Internet Explorer\MAIN" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKLM\SOFTWARE\Microsoft\Internet Explorer\MAIN" /v Default_Page_URL /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKCU\Software\Microsoft\Internet Explorer\Main" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKCU\Software\Microsoft\Internet Explorer\Main" /v "Local Page" /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKU\.DEFAULT\Software\Microsoft\Internet Explorer\Main" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKU\.DEFAULT\Software\Microsoft\Internet Explorer\Main" /v "First Home Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul

echo.&echo.
echo(--------------------------Angel------------------------------------
echo 	我今天没吃药，
echo 		感觉自己萌萌哒，
echo 		      萌萌哒，羞羞哒，走路一蹦一跳哒 0.0 
echo(-----------------------------------------------Angel---------------
echo.    
echo 1开启默认共享	2关闭默认共享	3右键添加管理员区的权限 c清除背景文件夹历史	q 退出
echo.&echo.
set /p option=input your choice:
if  "%option%"=="1" goto 1
if  "%option%"=="2" goto 2
if "%option%"=="3" goto 3
if "%option%"=="q" goto q
if "%option%"=="c" goto c
echo.&echo.
if not defined "%option%" goto x
:c
reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Wallpapers\Images /va /f>nul
echo 		It's cleard,soon back to menu
ping /n 2 127.1>nul
goto main
:q
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Internet Explorer\MAIN" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f >nul
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Internet Explorer\MAIN" /v Default_Page_URL /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKLM\SOFTWARE\Microsoft\Internet Explorer\MAIN" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKLM\SOFTWARE\Microsoft\Internet Explorer\MAIN" /v Default_Page_URL /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKCU\Software\Microsoft\Internet Explorer\Main" /v "Start Page"  /d ^http://www.2345.com/?ksukumo^ /f>nul
reg add "HKCU\Software\Microsoft\Internet Explorer\Main" /v "Local Page" /d ^http://www.2345.com/?ksukumo^ /f>nul
echo			SEE~YOU---------
ping /n 2 127.1>nul
exit
:1
reg delete HKLM\SYSTEM\CurrentControlSet\services\LanmanServer\Parameters /v autosharewks /f 2>nul
reg delete HKLM\SYSTEM\CurrentControlSet\services\LanmanServer\Parameters /v autoshareserver /f 2>nul&echo 已开启
net stop Server&net start Server&goto main
:2
reg add HKLM\SYSTEM\CurrentControlSet\services\LanmanServer\Parameters /v autoshareserver /t REG_DWORD /d 0 /f>nul
reg add HKLM\SYSTEM\CurrentControlSet\services\LanmanServer\Parameters /v autosharewks /t REG_DWORD /d 0 /f>nul&echo 已关闭
net stop Server&net start Server&goto main
:3
reg add HKCR\*\shell\runas /ve /t REG_SZ /d "获取管理员权限" /f>nul
reg add HKCR\*\shell\runas /v "NoWorkingDirectory" /t REG_SZ /d "" /f>nul
reg add HKCR\*\shell\runas\command /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul
reg add HKCR\*\shell\runas\command /v "IsolatedCommand"  /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul

reg add HKCR\exefile\shell\runas2  /ve /t REG_SZ /d "获取管理员权限" /f>nul
reg add HKCR\exefile\shell\runas2 /v "NoWorkingDirectory" /t REG_SZ /d "" /f>nul
reg add HKCR\exefile\shell\runas2\command /ve /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul
reg add HKCR\exefile\shell\runas2\command /v "IsolatedCommand" /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul

reg add HKCR\Directory\shell\runas /ve /t REG_SZ /d "获取管理员权限" /f>nul
reg add HKCR\Directory\shell\runas /v "NoWorkingDirectory" /t REG_SZ /d "" /f>nul
reg add HKCR\Directory\shell\runas\command /ve /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul
reg add HKCR\Directory\shell\runas\command /v "IsolatedCommand"  /t REG_SZ /d "cmd.exe /c takeown /f \"%%1\" && icacls \"%%1\" /grant administrators:F" /f>nul

goto main
:x
echo 		Input error,Soon back to menu
ping /n 2 127.1>nul
goto main
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
reg delete HKCR\Python.file\Shell\editwithidle /f
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
