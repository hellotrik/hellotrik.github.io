### 如何在百度安装tf-gpu==1.12.0

```python
#-*- coding:utf-8 -*-
import os,sys
if not os.path.exists('pypi2'):
    os.mkdir('pypi2')
cmd=[
    'wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/linux-64/cudatoolkit-9.0-h13b8566_0.conda -P pypi2/',
    'conda install --use-local pypi2/cudatoolkit-9.0-h13b8566_0.conda -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/',
    'python3.6 -m pip download tensorflow-gpu==1.12.0 keras==2.2.5 -i https://pypi.tuna.tsinghua.edu.cn/simple -d pypi2',
    'python3.6 -m pip install tensorflow-gpu==1.12.0 keras==2.2.5 --no-index -f ./pypi2']

if __name__=='__main__':
    if(len(sys.argv)<2):
        print(
'''
example:
    "python install.py [0|1|2|3]
    {0-->download cuda9.0
     1-->install cuda9.0
     2-->download tf-gpu and keras
     3-->install tf and keras
    }
''')
    elif sys.argv[1] in ['0','1','2','3']:
        if os.path.exists('pypi2/cudatoolkit-9.0-h13b8566_0.conda') and sys.argv[1]=='0':
            print('cu90 已经下好了^_^')
        else:
            os.system(cmd[int(sys.argv[1])])
    else:
        print('未知操作')
```


