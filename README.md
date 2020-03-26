## Welcome to Java
[![Image](https://avatars3.githubusercontent.com/u/20605668?s=460&u=69278b7499e3557b24d071dd2c0b4aff24cb153e&v=4)](https://holytrick.github.io/clock)
### [Bottleneck](./bottleneck)
### 在百度AISTUDIO安装pytorch
```python
import os
if not os.path.exists('pypi'):
	os.mkdir('pypi')
if not 'lxml' in ' '.join(os.listdir('pypi/')):
	os.system('pip download bs4 lxml xlwt xlrd seaborn -i https://pypi.tuna.tsinghua.edu.cn/simple -d pypi')
if not 'torch' in ' '.join(os.listdir('pypi/')):
	os.system('pip download torch==1.4.0+cu92 torchvision==0.5.0+cu92 -f https://download.pytorch.org/whl/torch_stable.html -d pypi')
if os.popen('pip show torch').read()=='' and 'torch' in ' '.join(os.listdir('pypi/')):
	os.system('pip install bs4 lxml xlwt xlrd seaborn torch torchvision --no-index -f ./pypi')
print(
'''
    ██╗   ██╗ ██████╗ ██╗      █████╗  ██████╗████████╗
    ╚██╗ ██╔╝██╔═══██╗██║     ██╔══██╗██╔════╝╚══██╔══╝
     ╚████╔╝ ██║   ██║██║     ███████║██║        ██║   
      ╚██╔╝  ██║   ██║██║     ██╔══██║██║        ██║   
       ██║   ╚██████╔╝███████╗██║  ██║╚██████╗   ██║   
       ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝ 写框架这东西,老子背也要背会
     █████╗ ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
    ██╔══██╗██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ███████║██║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
    ██╔══██║██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
    ██║  ██║██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
    ╚═╝  ╚═╝╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
'''
)
```
### 在百度AISTUDIO安装tensorflow
```python
#-*- coding:utf-8 -*-
import os,sys
if not os.path.exists('pypi2'):
    os.mkdir('pypi2')

cmd=[
    'wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/linux-64/cudatoolkit-9.0-h13b8566_0.conda -P pypi2/',
    'python3.6 -m pip download tensorflow-gpu==1.12.0 keras==2.1.5 -i https://pypi.tuna.tsinghua.edu.cn/simple -d pypi2',
    'conda install --use-local pypi2/cudatoolkit-9.0-h13b8566_0.conda -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/',
    'python3.6 -m pip install tensorflow-gpu==1.12.0 keras==2.1.5 --no-index -f ./pypi2']

if __name__=='__main__':
    if(len(sys.argv)<2):
        print('自动模式:Auto check And install\n如果安装失败请使用手动模式0或1强制下载数据,然后重新运行自动模式')
        if not os.path.exists('pypi2/cudatoolkit-9.0-h13b8566_0.conda'):
            os.system(cmd[0])
        if not os.path.exists('pypi2/tensorflow_gpu-1.12.0-cp36-cp36m-manylinux1_x86_64.whl'):
            os.system(cmd[1])
        if not 'cudatoolkit' in os.popen('conda list cudatoolkit').read():
            os.system(cmd[2])
        if os.popen('python3.6 -m pip show keras').read()=='':
            os.system(cmd[3])
        print('都装完了老板,请在命令行输入 python3.6 进行测试')
    elif sys.argv[1] in ['0','1','2','3']:
        if os.path.exists('pypi2/cudatoolkit-9.0-h13b8566_0.conda') and sys.argv[1]=='0':
            print('cu90 已经下好了^_^')
        else:
            os.system(cmd[int(sys.argv[1])])
    else:
                print(
'''
手动模式:
    "python install.py [0|1|2|3]
    {0-->download cuda9.0
     1-->download tf-gpu and keras
     2-->install cuda9.0
     3-->install tf and keras
    }
''')

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
