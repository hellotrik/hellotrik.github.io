## Welcome to Java
[![Image](https://avatars3.githubusercontent.com/u/20605668?s=460&u=69278b7499e3557b24d071dd2c0b4aff24cb153e&v=4)](https://mrq-lhr.github.io/蒅)
### [在百度安装tf-gpu==1.12.0](https://mrq-lhr.github.io/install)

### [Markdown](clock.html)
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
![](
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
)
