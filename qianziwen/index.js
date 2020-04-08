var clock = document.getElementsByClassName('clock')[0];
var monthContent = ["天", "地", "玄", "黄", "宇", "宙", "洪", "荒", "日", "月", "盈", "昃"];
var dayContent = ["晨", "宿", "列", "张", "寒","来","暑","往","秋","收","冬","藏", 
	"闰","余","成","岁", "律","吕","调","阳", 
	"云","腾","致","雨", "露","结","为","霜",
	"金","生","丽水"];
var weekContent = ["玉","出","昆","冈", "剑","号","巨阙"];
var hourContent = ["珠","称","夜","光", "果","珍","李","柰",
	"菜","重","芥","姜", "海","咸","河","淡",
	"鳞","潜","羽","翔", "龙","师","火","帝"];
var minuteContent = ["鸟","官","人","皇", "始","制","文","字",
	"乃","服","衣","裳", "推","位","让","国",
	"有","虞","陶","唐", "吊","民","伐","罪",
	"周","发","殷","汤", "坐","朝","问","道",
	"垂","拱","平","章", "爱","育","黎","首",
	"臣","服","戎","羌", "遐","迩","一","体",
	"率","宾","归","王", "鸣","凤","在","竹",
	"白","驹","食","场"];
var secondsContent = ["化被草木","huà pi cǎo mù","赖及万方","lài jí wàn fāng",
	"盖此身发","gài cǐ shēn fà","四大五常","sì dà wǔ cháng",
	"恭惟鞠养","gōng wéi jū yǎng","岂敢毁伤","qǐ gǎn huǐ shāng",
	"女慕贞洁","nǚ mù zhēn jié","男效才良","nán xiào cái liáng",
	"知过必改","zhī guò bì gǎi","得能莫忘","dé néng mò wàng",
	"罔谈彼短","wǎng tán bǐ duǎn","靡恃己长","mí shì jǐ cháng",
	"信使可覆","xìn shǐ kě fù","器欲难量","qì yù nán liáng",
	"墨悲丝染","mò bēi sī rǎn","诗赞羔羊","shī zàn gāo yáng",
	"景行维贤","jǐng xíng wéi xián","克念作圣","kè niàn zuò shèng",
	"德建名立","dé jiàn míng lì","形端表正","xíng duān biǎo zhèng",
	"空谷传声","kōng gǔ chuán shēng","虚堂习听","xū táng xí tīng",
    "祸因恶积","huò yīn è jí","福缘善庆","fú yuán shàn qìng",
	"尺璧非宝","chǐ bì fēi bǎo","寸阴是竞","cùn yīn shì jìng",
	"资父事君","zī fù shì jūn","曰严与敬","yuē yán yǔ jìng",
	"孝当竭力","xiào dāng jié lì","忠则尽命","zhōng zé jìn mìng",
	"临深履薄","lín shēn lǚ báo","夙兴温凊","sù xīng wēn qìng"];
//存放生成dom元素
var monthDom=[];
var dayDom=[];
var weekDom=[];
var hourDom=[];
var minutesDom=[];
var secondsDom=[];
var allSet = [
                [monthContent,monthDom],
                [dayContent,dayDom],
                [weekContent,weekDom],
                [hourContent,hourDom],
                [minuteContent,minutesDom],
                [secondsContent,secondsDom]
            ];



var isChange = false;

function btnClick(){
    isChange = true;
    document.getElementsByClassName("btn")[0].style.display = "none"
    clock.style.transform = "rotate(90deg)"
    setTimeout(() => {
        showText()
    }, 200);
}

window.onload = function(){
    init();
    changePosition();
    setInterval(() => {
        getTime();
    }, 100);
}


//初始化样式
function init(){
    for(var i=0;i<allSet.length;i++){
        for(var j=0;j<allSet[i][0].length;j++){
            var temp = createLabel(allSet[i][0][j]);
            clock.appendChild(temp);
            allSet[i][1].push(temp);
        }
    }
}

function createLabel(text){
    var oDiv = document.createElement("div");
    oDiv.innerText = text;
    oDiv.classList.add("label");
    return oDiv;
}


function getTime(){
    var labels = document.getElementsByClassName("label");
    for(var i=0;i<labels.length;i++){
        labels[i].style.fontWeight = "normal"
        labels[i].style.color = "#000";
    }

    var now = new Date();
    var month = now.getMonth();
    var day = now.getDate();
    var week = now.getDay();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var seconds = now.getSeconds()
    var nowValue = [month,day-1,week,hour,minute,seconds];
    for(var i=0;i<nowValue.length;i++){
        var index = nowValue[i];
        allSet[i][1][index].style.color = "yellow"
        allSet[i][1][index].style.fontWeight = "bolder"
    }

    if(isChange){
        var midX = document.body.clientWidth / 2;
        var midY = document.body.clientHeight / 2 -100;
        for(var i=0;i<allSet.length;i++){
            for(var j=0;j<allSet[i][1].length;j++){
                var r = (i+1)*25 + i*35;
                var deg = 360 / allSet[i][0].length *(j-nowValue[i]);
                var x = midX + r * Math.sin(deg*Math.PI/180);
                var y = midY - r * Math.cos(deg*Math.PI/180);
                allSet[i][1][j].style.left = x + "px";
                allSet[i][1][j].style.top = y + "px";
                allSet[i][1][j].style.transform = "rotate("+(deg-90)+"deg)";
            }
        }
    }


}

function changePosition(){
    for(let i=0;i<allSet.length;i++){
        for(let j=0;j<allSet[i][1].length;j++){
            let x = allSet[i][1][j].offsetLeft;
            let y = allSet[i][1][j].offsetTop;
            setTimeout(() => {
                allSet[i][1][j].style.position = "absolute";
                allSet[i][1][j].style.left = x + "px";
                allSet[i][1][j].style.top = y + "px";
            }, 50);
        }
    }
}


function showText(){
    var logo = "你这个人，不太会说话 ,,,,也不太会谈恋爱 ,,,,所以呢?谈什么恋爱 ,,,,背背千字文 ,,,,学学写汉字 ,,,,别像个傻x ,,,,别那么恶心 ,,,,别那么烦人 ,,,,屁话怎么这么多 ,,,,青山木谷实 ,,,,abcdefg ,,,,花言巧语费口舌 ,,,,理由那么多 ,,,,都是坑哥的"
    // var logo = "我是一个俗人 ,,,,看山是山 ,,,,看海是海 ,,,,看花是花 ,,,,唯独见了你 ,,,,心潮开始翻涌 ,,,,山岳百川开始震荡 ,,,,满天星光开始闪烁 ,,,,无需你一声令下 ,,,,我和天地间万物便通通奔向你";
    var ptext = document.getElementsByClassName('text')[0];
    var flag = 0;
    var show = true;
    var mouse = document.createElement("span");
    mouse.style.position='absolute';
    mouse.style.left ='0';
    mouse.style.top ='0';
    mouse.innerText = "__"
    ptext.append(mouse);
    var timer = setInterval(function(){
        if(flag<logo.length){
            if(logo.charAt(flag)!=","){
                mouse.style.left =  parseInt(mouse.style.left) + "px"
            }

            if(logo.charAt(flag) == " "){
                mouse.style.left = 0 + "px"
                mouse.style.top = 29 + parseInt(mouse.style.top)+"px"
                ptext.appendChild(document.createElement("br"))
            }else if(logo.charAt(flag) == ","){
                if(!show){
                    mouse.style.display = "inline-block";
                }else{
                    mouse.style.display = "none";
                }
                show =!show;
            }else{
                mouse.style.left = 20 +parseInt(mouse.style.left) + "px"
                var span = document.createElement("span");
                span.innerText = logo.charAt(flag);
                ptext.append(span)
            }

            flag++;


        }else{
            clear();
            mouse.style.display='none'
        }
    },150)
    function clear(){
        clearInterval(timer)
    }
}
