<div class="player player-mid f-cb f-pr">
<div class="cover cover-sm f-pr">
<img id="cover" src="//p2.music.126.net/lMnOsiDP5d3DhZMfQ667xw==/109951163648597043.jpg?param=90y90">
<div class="mask"></div>
<div id="play" class="bg play-bg f-hide" data-action="play"></div>
<div id="pause" class="bg pause-bg" data-action="pause"></div>
</div>
<div id="mid-ctrl" class="ctrlBox" style="width: 224px;">
<h2 class="f-pr"><i data-action="home" class="bg logo"></i><div id="title" class="title" style="width: 200px;">年少有为 (Cover 李荣浩)<span class="sub"> - 蓝心羽</span></div></h2>
<div id="bar" class="bar" style="width: 180px;">
<div class="played j-flag" style="width: 14.9786%;"><span class="bg thumb j-flag" id="auto-id-wFPpUGId9EFhka4K"></span></div>
</div>
</div>
<span id="time" class="time">- 03:34</span>
</div>

## Welcome to Java
[![Image](https://avatars3.githubusercontent.com/u/20605668?s=460&u=69278b7499e3557b24d071dd2c0b4aff24cb153e&v=4)](https://mrq-lhr.github.io/蒅)

### [在百度安装tf-gpu==1.12.0](https://mrq-lhr.github.io/install)

### [Markdown](./bottleneck)
Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for


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
       ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝ 开发框架中....
     █████╗ ██╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
    ██╔══██╗██║    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
    ███████║██║    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
    ██╔══██║██║    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
    ██║  ██║██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
    ╚═╝  ╚═╝╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
'''
)
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
