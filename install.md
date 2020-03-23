### [如何在百度安装tf-gpu==1.12.0](https://mrq-lhr.github.io)

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
        print('自动模式:Auto check And install')
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


