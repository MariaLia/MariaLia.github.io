window.onload = function(){
    !function(){
        //PID 表示是谁的(ID)子级
        var aData = [{PID:0,ID:1, name:'字体'},{PID:0,ID:2, name:'软件'},{PID:0,ID:3, name:'视频'},{PID:0,ID:4, name:'电子书'},{PID:1,ID:5, name:'方正字体'},{PID:1,ID:6, name:'兰亭字体'},{PID:2,ID:7, name:'PS'},{PID:2,ID:8, name:'DW'},{PID:2,ID:9, name:'AI'},{PID:3,ID:10, name:'设计教程'},{PID:3,ID:11, name:'HTML5'},{PID:3,ID:12, name:'CSS3'},{PID:4,ID:13, name:'高级程序设计'},{PID:10,ID:14, name:'平面设计'}];
        var data = [];//存储筛选数据
        var num = aData.length;//num++ 控制ID值得改变
        var nowPID = 0;//记录父级的ID,默认值是0
        var nnn = [];
        var nn1 = null;  //记录拖拽时鼠标点的那个文件夹的ID

        var oYun = document.getElementById('baiduyun');
        var aBtn = oYun.getElementsByClassName('btn');//aBtn[0]-新建  aBtn[1]-删除  aBtn[2]-重命名
        var oContent = oYun.getElementsByClassName('content')[0];
        var oConDl = oContent.children;
        var oTxt = oYun.getElementsByClassName('txt')[0];//oTxt.children[0]-面包屑导航  oTxt.children[1]-数量统计
        var oCrumbNav = oTxt.children[0];//面包屑导航
    
        var oSection = document.getElementsByTagName('section')[0];  //白色内容区域
        var oContent_menu = oSection.getElementsByClassName('content-menu')[0];  //空白处右键
        var oFile_menu = oSection.getElementsByClassName('file-menu')[0];  //文件夹上右键
        
        var path = [];  //记录点击路径
        var checkFile = [];  //存储选中的文件夹
        var cloneFile = [];  //存储克隆出来的文件夹
        
        var oCheckBox = oYun.getElementsByClassName('checkbox')[0];//全选
        var oBigRename = oYun.getElementsByClassName('bigrename')[0];//重命名
        var oInput = oBigRename.getElementsByTagName('input')[0];//重命名输入框

        var oTrue = oBigRename.getElementsByClassName('true')[0];//重命名 - √
        var oFalse = oBigRename.getElementsByClassName('false')[0];//重命名 - ×
        
        ////////////////////////////////// 左侧NAV区域 //////////////////////////////////
        var oNav = document.getElementsByTagName('nav')[0];
        var oNav_All = oNav.children[0].children[0];  //左侧导航——全部文件
    
        /////////////////////////////////// 搜索文件 ///////////////////////////////////
    
        var oHeader_right = document.getElementsByClassName('header right')[0];  //白色区域搜索条 + 排序 + 视图
        var oSearch_Ipt = oHeader_right.children[0].children[0];  //搜索框
        var oSearch_Btn = oHeader_right.children[0].children[1];  //搜索按钮
    
        var oChange_View = oHeader_right.children[2];  //切换视图按钮
        var oDetail_Content = document.getElementById('detail-content');
        var oDetail_Cont_Div = oDetail_Content.getElementsByTagName('div');
        var oDetail_Check = document.getElementById('detail-check');  //
        var oDetail_btnCheck = oDetail_Check.children[0].children[0];  //详细列表的全选复选框
        var oDetail_txtCheck = oDetail_Check.children[0].children[1];  //详细列表的全选复选框的文字
        var oDetail_Rename = oDetail_Content.children[0];  //详细列表的重命名弹窗
        var oDetail_Rename_Input = oDetail_Content.children[0].children[0];  //详细列表的重命名输入框
        var oDetail_Rename_True = oDetail_Content.children[0].children[1];  //详细列表的重命名√
        var oDetail_Rename_False = oDetail_Content.children[0].children[2];  //详细列表的重命名×
        
        var isView = true;  //true - 详细列表; false - 大图
        
        
        var oContainer = null;  //记录重命名时被选中的哪个对象
        var oInsulate = false;  //隔离开关-控制重命名时的其余不能操作
        var isNewFile = false;  //查看是否处在新建文件夹状态
        var isDown = false;  //控制画选框的开关
        var isDrag = false;

        var oNewObj = null;  //存储新建的数据赋址
        var storPID = null;

        var arrName = [];  //存贮新建文件夹名字
        var fileNum = 20;  //新建文件夹的数量

        var arrName2 = ['新建文件夹'];//新建文件夹名字-用于比较
        for(var i=2; i<fileNum; i++){
            arrName2.push('新建文件夹' + '(' + i + ')');
        }
        
        location.hash = 'path=%2F';  //初始化hash
        oNav_All.style.backgroundColor = location.hash == '#path=%2F' ? '#77acff' : '';
        filData();  //根据nowPID筛选数据
        newBuilt(data);  //根据数据渲染页面

        var oCheckBtn = oCheckBox.getElementsByTagName('b')[0];//全选的复选框
        var oCheckTxt = oCheckBox.getElementsByTagName('span')[0];//全选后面的文字内容

        //全选按钮点击事件
        oCheckBtn.onclick = function(){
            if(oInsulate) return;
            if(oConDl.length == 1) return;
            if(this.index != 0){
                this.style.backgroundPosition = '-40px 0';
                this.index = 0;
                for(var i=1; i<oContent.children.length; i++){
                    var oIconDd = oContent.children[i].children[2];//文件夹左上角的√
                    oIconDd.index = 1;
                    oIconDd.style.display = 'block';
                    oIconDd.style.backgroundImage = 'url(img/checker0.png)';
                    oIconDd.parentNode.className = 'click';
                    oCheckTxt.innerHTML = '已选中' + (oContent.children.length-1) + '个文件/文件夹';
                }
            }else{
                this.index = 1;
                this.style.backgroundPosition = '';
                for(var i=1; i<oContent.children.length; i++){
                    var oIconDd = oContent.children[i].children[2];
                    oIconDd.index = 0;
                    oIconDd.style.display = '';
                    oIconDd.style.backgroundImage = '';
                    oIconDd.parentNode.className = '';
                    oCheckTxt.innerHTML = '全选';
                }
            }
        };
    
        //详细列表全选按钮点击事件
        oDetail_btnCheck.onclick = function(){
            if(oInsulate) return;
            var aDetail_Div = oDetail_Content.getElementsByTagName('div');
            if(aDetail_Div.length == 0) return;
            
            if(this.index != 0){
                this.style.backgroundPosition = '-40px 0';
                this.index = 0;
                for(var i=0; i<aDetail_Div.length; i++){
                    var oB = aDetail_Div[i].children[0].children[0]; //文件夹左上角的√
                    oB.index = 1;
                    oB.style.backgroundPosition = '-40px 0';
                    aDetail_Div[i].style.backgroundColor = '#f6faff';
                    oDetail_txtCheck.innerHTML = '已选中' + oDetail_Cont_Div.length + '个文件/文件夹';
                }
            }else{
                this.index = 1;
                this.style.backgroundPosition = '';
                for(var i=0; i<aDetail_Div.length; i++){
                    var oB = aDetail_Div[i].children[0].children[0]; //文件夹左上角的√
                    oB.index = 0;
                    oB.style.backgroundPosition = '0 0';
                    aDetail_Div[i].style.backgroundColor = '';
                    oDetail_txtCheck.innerHTML = '文件名';
                }
            }
        };

        //为三个功能按钮添加移入移出事件
        for(var i=0; i<aBtn.length; i++){
            aBtn[i].onmouseover = function(){
                this.style.background = '#3b8cff';
                this.style.color = '#fff';
                this.style.borderColor = '#3b8cff';
            };
            aBtn[i].onmouseout = function(){
                this.style.cssText = '';
            }
        }

        //新建文件夹-点击事件
        aBtn[0].onclick = newFile;
        
        //删除按钮
        aBtn[1].onclick = DeleteFile;

        //重命名按钮
        aBtn[2].onclick = Rename;
        
        //重命名函数
        function Rename(){
            if(oInsulate) return;   //重命名时不能执行操作
    
            var num1 = 0;   //记录有几个选中 如果选中的是多个文件夹 就跳出函数
            
            if(isView){
                for(var i=1; i<oContent.children.length; i++){
                    if(oContent.children[i].children[2].index == 1){
                        num1++;
                        if(num1 > 1){
                            return;
                        }
                    }
                }
    
                for(var i=1; i<oContent.children.length; i++){
                    if(oContent.children[i].children[2].index == 1){
                        var l = oContent.children[i].offsetLeft;
                        var t = oContent.children[i].offsetTop;
            
                        oInsulate = true;//隔离开关
                        oContainer = oContent.children[i];//记录选中的对象
            
                        oInput.value = oContent.children[i].children[1].firstElementChild.innerHTML;
                        oBigRename.style.cssText = 'display:block;left:'+ l +'px;top:'+ t +'px';
                        oInput.select();//默认文字选中
                    }
                }
                fn();
            }else{
                for(var i=0; i<oDetail_Cont_Div.length; i++){
                    var oB = oDetail_Cont_Div[i].children[0].children[0];
                    if(oB.index == 1){
                        num1++;
                        if(num1 > 1){
                            return;
                        }
                    }
                }
                
                for(var i=0; i<oDetail_Cont_Div.length; i++){
                    var oB = oDetail_Cont_Div[i].children[0].children[0];
                    if(oB.index == 1){
                        var l = oDetail_Cont_Div[i].offsetLeft + 80;
                        var t = oDetail_Cont_Div[i].offsetTop;
                        oInsulate = true;//隔离开关
                        oContainer = oDetail_Cont_Div[i];//记录选中的对象
    
                        oDetail_Rename_Input.value = oDetail_Cont_Div[i].children[0].children[1].innerHTML;
                        oDetail_Rename.style.cssText = 'display:block;left:'+ l +'px;top:'+ t +'px';
                        oDetail_Rename_Input.select();//默认文字选中
                    }
                }
                fn1();
            }
        }
        
        //删除文件夹函数
        function DeleteFile(){
            if(oInsulate) return;//重命名时不能执行删除操作
            if(isView){
                for(var i=1; i<oContent.children.length; i++){
                    if(oContent.children[i].children[2].index == 1){
                        //删除数据
                        nnn.push(oContent.children[i].ID);
            
                        for(var k in data){
                            if(oContent.children[i].ID == data[k].ID){
                                data.splice(k,1);
                            }
                        }
                        var oInputText = oContent.children[i].children[1].firstElementChild.innerHTML;
                        for(var j=0; j<arrName2.length; j++){
                
                            if(arrName2[j] == oInputText){
                                if(oInputText == '新建文件夹'){
                                    arrName.push('新建文件夹(1)')
                                }else{
                                    arrName.push(oInputText)
                                }
                            }
                        }
            
                        //删除DOM结构
                        oContent.removeChild(oContent.children[i]);
                        i--;
                    }
                }
            }else{
                for(var i=0; i<oDetail_Cont_Div.length; i++){
                    var oB = oDetail_Cont_Div[i].children[0].children[0];
                    if(oB.index == 1){
                        //删除数据
                        nnn.push(oDetail_Cont_Div[i].ID);
            
                        for(var k in data){
                            if(oDetail_Cont_Div[i].ID == data[k].ID){
                                data.splice(k,1);
                            }
                        }
                        var oInputTxt = oDetail_Cont_Div[i].children[0].children[1].innerHTML;
                        for(var j=0; j<arrName2.length; j++){
                
                            if(arrName2[j] == oInputTxt){
                                if(oInputTxt == '新建文件夹'){
                                    arrName.push('新建文件夹(1)')
                                }else{
                                    arrName.push(oInputTxt)
                                }
                            }
                        }
            
                        //删除DOM结构
                        oDetail_Content.removeChild(oDetail_Cont_Div[i]);
                        i--;
                    }
                }
            }
    
            deleteE(nnn);  //删除所有子集
    
            arrName.sort(function(a,b){
                return parseInt(a.substr(6)) - parseInt(b.substr(6));
            });
    
            checkAll();  //判断全选
            oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
            
        }

        function fn(){
            //重命名 - √
            oTrue.onclick = function(){
                var oInputText = oContainer.children[1].firstElementChild.innerHTML;  //被选中的文件夹的名称
                if(oInput.value == oInputText){
                    //修改DOM
                    oContainer.children[1].firstElementChild.innerHTML = oInput.value;
                    oBigRename.style.cssText = '';
                    oInsulate = false;//隔离开关
                }else{
                    var isRename = false;
                    for(var i=0; i<data.length; i++){
                        if(oInput.value == data[i].name){
                            isRename = true;
                            alert('名字重复!!');
                        }
                    }
                    if(!isRename){
                        for(var i=0; i<data.length; i++){
                            //修改DOM
                            oContainer.children[1].firstElementChild.innerHTML = oInput.value;
                            oBigRename.style.cssText = '';
        
                            //修改数据 赋址↓↓↓ - aData中的数据也会被修改
                            if(data[i].ID == oContainer.ID){
                                data[i].name = oInput.value;
                            }
                            oInsulate = false;//隔离开关
                        }
                    }
                }
                
                //如果是新建文件夹系列，再把数据放回数组
                for(var j=0; j<arrName2.length; j++){
        
                    if(arrName2[j] == oInputText){
                        if(oInputText == '新建文件夹'){
                            arrName.push('新建文件夹(1)')
                        }else{
                            arrName.push(oInputText)
                        }
                    }
                }
                
                //如果是新建文件夹系列，删除数据
                for(var i=0; i<arrName.length; i++){
                    for(var j=0; j<data.length; j++){
                        if(arrName[i] == data[j].name){
                            arrName.splice(i,1)
                        }
                    }
                }
                //重新排列数据
                arrName.sort(function(a,b){
                    return parseInt(a.substr(6)) - parseInt(b.substr(6));
                });
            };

            //重命名 - ×
            oFalse.onclick = function(){
                oBigRename.style.cssText = '';
                oInsulate = false;//隔离开关
            };
        }
    
        function fn1(){
            //重命名 - √
            oDetail_Rename_True.onclick = function(){
                var oInputText = oContainer.children[0].children[1].innerHTML;
    
                if(oDetail_Rename_Input.value == oInputText){
                    //修改DOM
                    oContainer.children[0].children[1].innerHTML = oDetail_Rename_Input.value;
                    oDetail_Rename.style.cssText = '';
                    oInsulate = false;//隔离开关
                }else{
                    var isRename = false;
                    for(var i=0; i<data.length; i++){
                        if(oDetail_Rename_Input.value == data[i].name){
                            isRename = true;
                            alert('名字重复!!');
                        }
                    }
                    if(!isRename){
                        for(var i=0; i<data.length; i++){
                            //修改DOM
                            oContainer.children[0].children[1].innerHTML = oDetail_Rename_Input.value;
                            oDetail_Rename.style.cssText = '';
    
                            //修改数据 赋址↓↓↓ - aData中的数据也会被修改
                            if(data[i].ID == oContainer.ID){
                                data[i].name = oDetail_Rename_Input.value;
                            }
                            oInsulate = false;//隔离开关
                        }
                    }
                }
            
                //如果是新建文件夹系列，再把数据放回数组
                for(var j=0; j<arrName2.length; j++){
                
                    if(arrName2[j] == oInputText){
                        if(oInputText == '新建文件夹'){
                            arrName.push('新建文件夹(1)')
                        }else{
                            arrName.push(oInputText)
                        }
                    }
                }
            
                //如果是新建文件夹系列，删除数据
                for(var i=0; i<arrName.length; i++){
                    for(var j=0; j<data.length; j++){
                        if(arrName[i] == data[j].name){
                            arrName.splice(i,1)
                        }
                    }
                }
                //重新排列数据
                arrName.sort(function(a,b){
                    return parseInt(a.substr(6)) - parseInt(b.substr(6));
                });
            };
        
            //重命名 - ×
            oDetail_Rename_False.onclick = function(){
                oDetail_Rename.style.cssText = '';
                oInsulate = false;//隔离开关
            };
        }

        function fn2(){
            //新建文件夹 - 点击√
            oTrue.onclick = function(){
                for(var i=0; i<data.length; i++){
                    if(oInput.value == data[i].name){
                        alert('名字重复');
                        return;
                    }
                }

                if(oInput.value == '新建文件夹'){
                    oNewObj.name = '新建文件夹(1)';
                }else{
                    oNewObj.name = oInput.value;
                }
    
                data.push(oNewObj);
                aData.push(oNewObj);

                //如果是新建文件夹系列，删除数据
                for(var i=0; i<arrName.length; i++){
                    for(var j=0; j<data.length; j++){
                        if(arrName[i] == data[j].name){
                            arrName.splice(i,1)
                        }
                    }
                }

                oContent.children[1].getElementsByTagName('a')[0].innerHTML = oInput.value;
                oBigRename.style.cssText = '';
                oInsulate = false;//隔离开关
                isNewFile = false;  //新建文件夹开关关闭
                oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
            };

            //新建文件夹 - 点击×
            oFalse.onclick = function(){
                oBigRename.style.cssText = '';
                oContent.removeChild(oContent.children[1]);
                oInsulate = false;  //隔离开关
                isNewFile = false;  //新建文件夹开关关闭
            };
        }
        
        function fn3(){
            //详细列表 - 新建文件夹 - 点击√
            oDetail_Rename_True.onclick = function(){
                for(var i=0; i<data.length; i++){
                    if(oDetail_Rename_Input.value == data[i].name){
                        alert('名字重复');
                        return;
                    }
                }

                if(oDetail_Rename_Input.value == '新建文件夹'){
                    oNewObj.name = '新建文件夹(1)';
                }else{
                    oNewObj.name = oDetail_Rename_Input.value;
                }
    
                data.push(oNewObj);
                aData.push(oNewObj);

                //如果是新建文件夹系列，删除数据
                for(var i=0; i<arrName.length; i++){
                    for(var j=0; j<data.length; j++){
                        if(arrName[i] == data[j].name){
                            arrName.splice(i,1)
                        }
                    }
                }

                oDetail_Content.children[1].children[0].children[1].innerHTML = oDetail_Rename_Input.value;
                oDetail_Rename.style.cssText = '';
                oInsulate = false;//隔离开关
                isNewFile = false;  //新建文件夹开关关闭
                oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
            };

            //新建文件夹 - 点击×
            oDetail_Rename_False.onclick = function(){
                oDetail_Rename.style.cssText = '';
                oDetail_Content.removeChild(oDetail_Content.children[1]);
                oInsulate = false;  //隔离开关
                isNewFile = false;  //新建文件夹开关关闭
            };
        }
        
        //清除文件夹的选中状态
        function clearCheck(){
            if(isView){
                for(var i=1; i<oContent.children.length; i++){  //清除文件夹的选中样式
                    var oIconDd = oContent.children[i].children[2]; //复选的√
                    oIconDd.index = 0;  //当选中是值为1  未选中时值为0
                    oIconDd.style.display = '';
                    oIconDd.style.backgroundImage = '';
                    oIconDd.parentNode.className = '';
                }
            }else{
                var aDetail_Div = oDetail_Content.getElementsByTagName('div');
                for(var i=0; i<aDetail_Div.length; i++){
                    var oB = aDetail_Div[i].children[0].children[0];
                    oB.index = 0;  //当选中是值为1  未选中时值为0
                    oB.style.backgroundPosition = '0 0';
                    aDetail_Div[i].style.background = '';
                }
            }
        }
        
        //新建文件夹s
        function newFile(){
            if(oInsulate) return;  //重命名时不能执行新建操作
            oInsulate = true;
            isNewFile = true;  //新建文件夹时开关打开
            clearCheck();  //清除文件夹的选中状态
            
            var a = {};
            a.PID = nowPID;
            a.ID = ++num;
            a.name = '';
            oNewObj = a;
    
            if(storPID != nowPID){
                arrName = [];
                //noinspection JSDuplicatedDeclaration
                for(var i=1; i<fileNum; i++){
                    arrName.push('新建文件夹' + '(' + i + ')');
                }
            }
    
            filData();
    
            //noinspection JSDuplicatedDeclaration//如果是新建文件夹系列，删除数据
            for(var i=0; i<arrName.length; i++){
                for(var j=0; j<data.length; j++){
                    if(arrName[i] == data[j].name){
                        arrName.splice(i,1)
                    }
                }
            }
            
            if(isView){
                newBuilt([a]);
    
                //重命名弹窗
                for(var i=1; i<oContent.children.length; i++){
                    if(a.ID == oContent.children[i].ID){
                        var l = oContent.children[i].offsetLeft;
                        var t = oContent.children[i].offsetTop;
                    }
                }
                
                if(arrName[0] == '新建文件夹(1)'){
                    oInput.value = '新建文件夹';
                }else{
                    oInput.value = arrName[0];
                }
                oBigRename.style.cssText = 'display:block;left:'+ l +'px;top:'+ t +'px';
                oInput.select();
                fn2();
            }else{
                newDetail([a]);
                //重命名弹窗
                for(var i=0; i<oDetail_Cont_Div.length; i++){
                    if(a.ID == oDetail_Cont_Div[i].ID){
                        var l = oDetail_Cont_Div[i].offsetLeft + 80;
                        var t = oDetail_Cont_Div[i].offsetTop;
                    }
                }
    
                if(arrName[0] == '新建文件夹(1)'){
                    oDetail_Rename_Input.value = '新建文件夹';
                }else{
                    oDetail_Rename_Input.value = arrName[0];
                }
                oDetail_Rename.style.cssText = 'display:block;left:'+ l +'px;top:'+ t +'px';
                oDetail_Rename_Input.select();
                fn3();
            }
            checkAll();
            storPID = nowPID;
        }
    
        //删除aData数据函数 包括下面的子级数据也要删除
        function deleteE(n){
            var n1 = [];
            for(var j=0; j<n.length; j++){
                //先删除自身
                for(var i=0; i<aData.length; i++){
                    if(aData[i].ID == n[j]){
                        aData.splice(i,1);
                        i--;
                    }
                }
                //寻找子级
                for(var i=0; i<aData.length; i++){
                    if(aData[i].PID == n[j]){
                        n1.push(aData[i].ID);
                        aData.splice(i,1);
                        i--;
                    }
                }
            }
        
            //判断是否递归
            for(var j=0; j<n1.length; j++){
                for(var i=0; i<aData.length; i++){
                    if(aData[i].PID == n1[j]){
                        return deleteE(n1);
                    }
                }
            }
        }
        
        //全选函数
        function checkAll(){
            var n=0;
            if(isView){
                for(var i=1; i<oContent.children.length; i++){
                    var oIconDd = oContent.children[i].children[2];
                    if(oIconDd.index == 1) n++;
                }
                
                if(n == oContent.children.length-1){
                    oCheckBtn.style.backgroundPosition = '-40px 0';
                    oCheckBtn.index = 0;
                    oCheckTxt.innerHTML = '已选中' + (oContent.children.length-1) + '个文件/文件夹';
                }else{
                    oCheckBtn.index = 1;
                    oCheckBtn.style.backgroundPosition = '';
                    oCheckTxt.innerHTML = '全选';
                }
                
                if(oContent.children.length == 1){
                    oCheckBtn.index = 1;
                    oCheckBtn.style.backgroundPosition = '';
                    oCheckTxt.innerHTML = '全选';
                }
            }else{
                var aDetail_Div = oDetail_Content.getElementsByTagName('div');
                for(var i=0; i<aDetail_Div.length; i++){
                    var oB = aDetail_Div[i].children[0].children[0];
                    if( oB.index == 1) n++;
                }
                
                if(n == aDetail_Div.length){
                    oDetail_btnCheck.style.backgroundPosition = '-40px 0';
                    oDetail_btnCheck.index = 0;
                    oDetail_txtCheck.innerHTML = '已选中' + (oContent.children.length-1) + '个文件/文件夹';
                }else{
                    oDetail_btnCheck.index = 1;
                    oDetail_btnCheck.style.backgroundPosition = '';
                    oDetail_txtCheck.innerHTML = '文件名';
                }
                
                if(aDetail_Div.length == 0){
                    oDetail_btnCheck.index = 1;
                    oDetail_btnCheck.style.backgroundPosition = '';
                    oDetail_txtCheck.innerHTML = '文件名';
                }
            }
        }
        
        //筛选数据
        function filData(){
            data = [];//存储筛选数据
            for(var i=0; i<aData.length; i++){
                if(aData[i].PID == nowPID){
                    data.push(aData[i]);
                }
            }
        }
        
        //后退
        function prevFloor(){
            path.pop();
            if(path.length>0){
                nowPID = path[path.length-1].ID;
            }else{
                nowPID = 0;
            }
    
            if(nowPID == 0){
                location.hash = 'path=%2F';
            }else{
                location.hash = 'path=%2F';
                for(var i=0; i<path.length; i++){
                    location.hash += path[i].ID + '_' + path[i].name + '%2F';
                }
            }
            checkAll();  //去掉全选复选框的√
        }

        function newBuilt(d){
            for(var i=0; i<d.length; i++){
                var oDl = document.createElement('dl');
                oDl.PID = d[i].PID;
                oDl.ID = d[i].ID;
                var oDt = document.createElement('dt');
                var aNameDd = document.createElement('dd');
                var oA = document.createElement('a');
                oA.href = 'javascript:void(0)';
                if(d[i].name == '新建文件夹(1)'){
                    //noinspection JSDuplicatedDeclaration
                    var aNameText = document.createTextNode('新建文件夹');
                }else{
                    //noinspection JSDuplicatedDeclaration
                    var aNameText = document.createTextNode(d[i].name);
                }
                
                var oIconDd = document.createElement('dd');

                oA.appendChild(aNameText);
                aNameDd.appendChild(oA);
                oDl.appendChild(oDt);
                oDl.appendChild(aNameDd);
                oDl.appendChild(oIconDd);
                oContent.insertBefore(oDl,oContent.children[1]);

                //文件夹鼠标移入
                oDl.onmouseover = function(){
                    if(oInsulate) return;//重命名时不能执行操作

                    if( this.children[2].index == 1){
                        return;
                    }
                    this.className = 'hover';
                    this.children[2].style.display = 'block';
                };

                //√的点击事件
                oIconDd.addEventListener('mouseup',function(ev){
                    if(oInsulate) return;//重命名时不能执行操作
        
                    if(this.index !=1 ){
                        this.index = 1;
                        this.style.backgroundImage = 'url(img/checker0.png)';
                        this.parentNode.className = 'click';
                    }else{
                        this.index = 0;
                        this.style.backgroundImage = '';
                        this.parentNode.className = 'hover';
                    }
                });
    
                oIconDd.addEventListener('mousedown',function(ev){
                    ev.cancelBubble = true;  //在文件夹上点击的时候，阻止框选行为
                });
                
                //双击事件阻止冒泡 - 删除后续进程
                oIconDd.addEventListener('dblclick',function(ev){
                    ev.stopPropagation();
                });
                
                oDl.addEventListener('mousedown',function(ev){
                    ev.cancelBubble = true;  //在文件夹上点击的时候，阻止框选行为
                });

                //文件夹鼠标移出
                oDl.onmouseout = function(){
                    if(oInsulate) return;//重命名时不能执行操作

                    if( this.children[2].index == 1){
                        return;
                    }
                    this.className = '';
                    this.children[2].style.cssText = '';
                };
                
                //文件夹鼠标双击进入子级
                oDl.ondblclick = function(){
                    nowPID = this.ID;//记录父级的ID
                    
                    for(var i=0; i<data.length; i++){
                        if(this.ID == data[i].ID){
                            path.push(data[i]);//存入的是点击谁
                            location.hash += this.ID+ '_' + data[i].name + '%2F';
                        }
                    }
                };
                
                /////////////// 在文件夹上右键 ///////////////
                
                oDl.oncontextmenu = function(ev){
                    
                    ev.preventDefault();  //清除默认行为
                    ev.cancelBubble = true;  //阻止冒泡
                    oContent_menu.style.zIndex = '';  //空白地方的右键菜单消失
    
                    clearCheck();   //清除文件夹的选中状态
                    oBigRename.style.cssText = '';  //隐藏重命名弹窗
                    oInsulate = false;  //改变重命名隔离开关的状态
                    
                    if(isNewFile){  //如果是在新建文件夹时 右键 还要删除文件夹
                        oContent.removeChild(oContent.children[1]);
                        isNewFile = false;  //新建文件夹开关关闭
                    }
                    
                    oContainer = this;  //记录当前选中的文件夹
                    
                    var oDd = this.children[2];  //右键的文件夹为选中状态
                    if(oDd.index !=1 ){
                        oDd.index = 1;
                        oDd.style.display = 'block';
                        oDd.style.backgroundImage = 'url(img/checker0.png)';
                        this.className = 'click';
                    }
                  
                    var l = ev.clientX - oSection.offsetLeft;
                    var t = ev.clientY - oSection.offsetTop;
                    
                    oFile_menu.style.left = l + 'px';
                    oFile_menu.style.top = t + 'px';
                    oFile_menu.style.zIndex = 6;
                    
                    var oOpen = oFile_menu.children[0];  //打开
                    oOpen.onclick = function(){
                        nowPID = oContainer.ID;  //记录当前文件夹的ID
                        if(oContainer.PID == 0){
                            location.hash = 'path=%2F';
                        }
                        for(var i=0; i<data.length; i++){
                            if(oContainer.ID == data[i].ID){
                                path.push(data[i]);//存入的是点击谁
                                location.hash += data[i].name + '%2F';
                            }
                        }
                    };
                    
                    var oRename = oFile_menu.children[1];  //重命名
                    oRename.onclick = Rename;
                    
                    var  oDelete = oFile_menu.children[2];
                    oDelete.onclick = DeleteFile;
                };
            }
            oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
        }
    
        function newDetail(d){
            for(var i=0; i<d.length; i++){
                var oDiv = document.createElement('div');
                oDiv.className = 'row clearfix';
                oDiv.PID = d[i].PID;
                oDiv.ID = d[i].ID;
                
                var oP0 = document.createElement('p');
                oP0.className = 'fl';
                var oB = document.createElement('b');
                oB.className = 'fl';
                var oSpan = document.createElement('span');
                oSpan.className = 'fl txt-name';
    
                switch (d[i].name) {
                    case '新建文件夹(1)':
                        //noinspection JSDuplicatedDeclaration
                        var aNameText = document.createTextNode('新建文件夹');
                        break;
                    default:
                        //noinspection JSDuplicatedDeclaration
                        var aNameText = document.createTextNode(d[i].name);
                        break;
                }
            
                var oP1 = document.createElement('p');
                oP1.className = 'fl';
                oP1.innerHTML = '136.1M';
                var oP2 = document.createElement('p');
                oP2.className = 'fl';
                oP2.innerHTML = '2016-09-02 23:21';
                
                oSpan.appendChild(aNameText);
                oP0.appendChild(oB);
                oP0.appendChild(oSpan);
                oDiv.appendChild(oP0);
                oDiv.appendChild(oP1);
                oDiv.appendChild(oP2);
    
                oDetail_Content.insertBefore(oDiv,oDetail_Content.children[1]);
            
                //文件夹鼠标移入
                oDiv.onmouseenter = function(){
                    if(oInsulate) return;  //重命名时不能执行操作
                    var oB = this.children[0].children[0];
                    if( oB.index == 1) return;
                    this.style.backgroundColor = '#f6faff';
                };
    
                //文件夹鼠标移出
                oDiv.onmouseleave = function(){
                    if(oInsulate) return;//重命名时不能执行操作
                    var oB = this.children[0].children[0];
                    if( oB.index == 1) return;
                    this.style.backgroundColor = '';
                };
            
                //√的点击事件
                oB.addEventListener('mouseup',function(ev){
                    if(oInsulate) return;  //重命名时不能执行操作
                    var oDiv = this.parentNode.parentNode;
                    
                    if(this.index !=1 ){
                        ev.target.index = 1;
                        ev.target.style.backgroundPosition = '-40px 0';
                        oDiv.style.backgroundColor = '#f6faff';
                    }else{
                        ev.target.index = 0;
                        ev.target.style.backgroundPosition = '0 0';
                        oDiv.style.backgroundColor = '#f6faff';
                    }
                });
    
                oB.addEventListener('mousedown',function(ev){
                    ev.cancelBubble = true;  //在文件夹上点击的时候，阻止框选行为
                });
            
                //双击事件阻止冒泡 - 删除后续进程
                oB.addEventListener('dblclick',function(ev){
                    ev.stopPropagation();
                });
            
                oDiv.addEventListener('mousedown',function(ev){
                    ev.cancelBubble = true;  //在文件夹上点击的时候，阻止框选行为
                });
                
            
                //文件夹鼠标双击进入子级
                oDiv.ondblclick = function(){
                    nowPID = this.ID;//记录父级的ID
                
                    for(var i=0; i<data.length; i++){
                        if(this.ID == data[i].ID){
                            path.push(data[i]);//存入的是点击谁
                            location.hash += this.ID + '_' + data[i].name + '%2F';
                        }
                    }
    
                    console.log(nowPID,path);
                };
            
                /////////////// 在文件夹上右键 ///////////////
            
                oDiv.oncontextmenu = function(ev){
                
                    ev.preventDefault();  //清除默认行为
                    ev.cancelBubble = true;  //阻止冒泡
                    oContent_menu.style.zIndex = '';  //空白地方的右键菜单消失
                
                    clearCheck();   //清除文件夹的选中状态
                    oDetail_Rename.style.cssText = '';  //隐藏重命名弹窗
                    oInsulate = false;  //改变重命名隔离开关的状态
                
                    if(isNewFile){  //如果是在新建文件夹时 右键 还要删除文件夹
                        oDetail_Content.removeChild(oDetail_Content.children[1]);
                        isNewFile = false;  //新建文件夹开关关闭
                    }
                
                    oContainer = this;  //记录当前选中的文件夹
                
                    var oB = this.children[0].children[0];  //右键的文件夹为选中状态
                    if(oB.index !=1 ){
                        oB.index = 1;
                        oB.style.backgroundPosition = '-40px 0';
                        this.style.backgroundColor = '#f6faff';
                    }
                
                    var l = ev.clientX - oSection.offsetLeft;
                    var t = ev.clientY - oSection.offsetTop;
                
                    oFile_menu.style.left = l + 'px';
                    oFile_menu.style.top = t + 'px';
                    oFile_menu.style.zIndex = 6;
                
                    var oOpen = oFile_menu.children[0];  //打开
                    oOpen.onclick = function(){
                        nowPID = oContainer.ID;  //记录当前文件夹的ID
                        if(oContainer.PID == 0){
                            location.hash = 'path=%2F';
                        }
                        for(var i=0; i<data.length; i++){
                            if(oContainer.ID == data[i].ID){
                                path.push(data[i]);//存入的是点击谁
                                location.hash += data[i].name + '%2F';
                            }
                        }
                    };
                
                    var oRename = oFile_menu.children[1];  //重命名
                    oRename.onclick = Rename;
                
                    var  oDelete = oFile_menu.children[2];
                    oDelete.onclick = DeleteFile;
                };
            }
            oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
        }
    
        ///////////////////////////////////// 搜索文件 /////////////////////////////////////
        
        oSearch_Btn.onclick = function(){
            var oValue = oSearch_Ipt.value;
            var oContDl = oContent.getElementsByTagName('dl');
            
            for(var i=oContDl.length-1; i>-1; i--){
                oContent.removeChild(oContDl[i]);
            }
            
            for(var i=0; i<data.length; i++){
                if(data[i].name == oValue){
                    newBuilt([data[i]])
                }
            }
            oSearch_Ipt.value = '';  //清空搜索框
        };
        
        oChange_View.onclick = function(){
            /*
            * 切换视图后用data渲染数据
            * 点击 / 拖拽 / 判断全选 /
            * */
            
            if(isNewFile) return;
            var StroID = []; //储存哪个文件夹被选中了
            if(isView){
                isView = false;
                this.style.backgroundPosition = '-71px 0';  //切换到详细信息模式
                
                var aCheckDl = oContent.getElementsByTagName('dl');
                for(var i=0; i<aCheckDl.length; i++){
                    var oDl = aCheckDl[i].children[2];
                    if(oDl.index == 1){
                        StroID.push(aCheckDl[i].ID);
                    }
                }
                
                oContent.style.display = 'none';
                oCheckBox.style.display = 'none';
                
                oDetail_Content.style.display = 'block';
                oDetail_Check.style.display = 'block';
                
                var aDetail_Div = oDetail_Content.getElementsByTagName('div');
                
                console.log(StroID)
                for(var i=aDetail_Div.length-1; i>-1; i--){  //删除DOM中的所有文件夹
                    oDetail_Content.removeChild(aDetail_Div[i])
                }
                newDetail(data);  //根据data数据重新生成文件夹
                
                var aDetail_Div_1 = oDetail_Content.getElementsByTagName('div');  //获取到新生成的文件夹，然后判断哪个文件夹是选中状态，添加对应的样式
                for(var i=0; i<aDetail_Div_1.length; i++){
                    var oB = aDetail_Div_1[i].children[0].children[0];
                    for(var j=0; j<StroID.length; j++){
                        if(aDetail_Div_1[i].ID == StroID[j]){
                            oB.index = 1;
                            oB.style.backgroundPosition = '-40px 0';
                            aDetail_Div_1[i].style.backgroundColor = '#f6faff';
                        }
                    }
                }
                checkAll();
            }else{
                this.style.backgroundPosition = '-38px 0';  //切换到大图模式
                isView = true;
                
                var aDetail_Div_2 = oDetail_Content.getElementsByTagName('div');
                for(var i=0; i<aDetail_Div_2.length; i++){
                    var oB1 = aDetail_Div_2[i].children[0].children[0];
                    if(oB1.index == 1){
                        StroID.push(aDetail_Div_2[i].ID);
                    }
                }
                oContent.style.display = 'block';
                oCheckBox.style.display = 'block';
    
                oDetail_Content.style.display = 'none';
                oDetail_Check.style.display = 'none';
    
                for(var i=oContent.children.length-1; i>0; i--){  //删除DOM中的所有文件夹
                    oContent.removeChild(oContent.children[i])
                }
                newBuilt(data);
                var aCheckDl_1 = oContent.getElementsByTagName('dl');
                for(var i=0; i<aCheckDl_1.length; i++){
                    var oDd_1 = aCheckDl_1[i].children[2];
                    for(var j=0; j<StroID.length; j++){
                        if(aCheckDl_1[i].ID == StroID[j]){
                            oDd_1.index = 1;
                            oDd_1.style.display = 'block';
                            oDd_1.style.backgroundImage = 'url(img/checker0.png)';
                            aCheckDl_1[i].className = 'click';
                        }
                    }
                }
                checkAll();
            }
        };
        
        ///////////////////////////////////// 左侧NAV /////////////////////////////////////
        
        oNav_All.onclick = function(){
            this.style.backgroundColor = '#77acff';
            location.hash = 'path=%2F';
        };
        
        //根据hash值的改变，控制页面重新渲染数据
        window.onhashchange = function(){
            oNav_All.style.backgroundColor = location.hash == '#path=%2F' ? '#77acff' : '';  //左侧导航区全部文件背景色
            
            var arrPath = location.hash.split('%2F');
            oCrumbNav.innerHTML = '';  //清空面包屑导航里面的内容 然后再重新渲染
            
            if(isView){
                var oContDl = oContent.getElementsByTagName('dl');  //所有的文件夹
                for(var i=oContDl.length-1; i>-1; i--){  //清空所有文件夹
                    oContent.removeChild(oContDl[i]);
                }
            }else{
                var oContDiv = oDetail_Content.getElementsByTagName('div');  //所有的文件夹
                for(var i=oContDiv.length-1; i>-1; i--){  //清空所有文件夹
                    oDetail_Content.removeChild(oContDiv[i]);
                }
            }
            
            if(arrPath[arrPath.length-2] == '#path='){
                nowPID = 0;
                oCrumbNav.innerHTML = '<span>全部文件</span>';
                filData();//根据nowPID筛选数据
                if(isView){
                    newBuilt(data);   //根据数据渲染页面
                }else{
                    newDetail(data);
                }
                return;
            }
            
            nowPID = parseInt(arrPath[arrPath.length-2]);
    
            for(var i=path.length-1; i>0; i--){
                if(path[i].ID == nowPID){
                    break;
                }
                path.pop();
            }
            console.log(path);
            
            ////////////////////////////// 返回上一级 ///////////////////////////////
            var oPrev = document.createElement('a');
            oPrev.className = 'blue';
            oPrev.href = 'javascript:void(0)';
            oPrev.innerHTML = '返回上一级';
            oCrumbNav.appendChild(oPrev);
            
            oPrev.onclick = prevFloor;  //后退-返回上一级
            
            var oLine = document.createElement('span');
            oLine.className = 'blue';
            oLine.innerHTML = ' | ';
            oCrumbNav.appendChild(oLine);
            
            ////////////////////////////// 全部文件 ///////////////////////////////
            var oAllFile = oPrev.cloneNode(true);
            oAllFile.innerHTML = '全部文件';
            oCrumbNav.appendChild(oAllFile);
            oAllFile.PID = 0;
            
            oAllFile.onclick = function(){  //点击全部文件
                //nowPID = this.PID;
                path = [];
                location.hash = '#path=%2F';
            };
            
            switch (path.length) {
                case 1:
                    var oGt = document.createElement('span');
                    oGt.innerHTML = ' > ';
                    oCrumbNav.appendChild(oGt);
                    
                    var oSpan0 = document.createElement('span');
                    if(path[0].name == '新建文件夹(1)'){
                        oSpan0.innerHTML = '新建文件夹';
                    }else{
                        oSpan0.innerHTML = path[0].name;
                    }
                    oCrumbNav.appendChild(oSpan0);
                    break;
                    
                default:
                    for (var i = 0; i < path.length - 1; i++) {
                        var oGt1 = document.createElement('span');
                        oGt1.className = 'blue';
                        oGt1.innerHTML = ' > ';
                        oCrumbNav.appendChild(oGt1);
                        
                        var oA = document.createElement('a');
                        oA.className = 'blue';
                        oA.href = 'javascript:void(0)';
                        oA.ID = path[i].ID;
                        oA.PID = path[i].PID;
                        if(path[i].name == '新建文件夹(1)'){
                            oA.innerHTML = '新建文件夹';
                        }else{
                            oA.innerHTML = path[i].name;
                        }
                        oCrumbNav.appendChild(oA);
                        
                        /////////////////////////////// 其中任意一个面包屑 ///////////////////////////////
                        oA.onclick = function(){
                            nowPID = this.ID;
                            for(var i=path.length-1; i>0; i--){
                                if(path[i].ID == this.ID){
                                    break;
                                }
                                path.pop();
                            }
                            location.hash = 'path=%2F';
                            for(var i=0; i<path.length; i++){
                                location.hash += path[i].ID + '_' + path[i].name + '%2F';
                            }
                        }
                    }
                    var oGt2 = document.createElement('span');
                    oGt2.innerHTML = ' > ';
                    oCrumbNav.appendChild(oGt2);
                    
                    var oSpan1 = document.createElement('span');
                    if(path[path.length - 1].name == '新建文件夹(1)'){
                        oSpan1.innerHTML = '新建文件夹';
                    }else{
                        oSpan1.innerHTML = path[path.length - 1].name;
                    }
                    oCrumbNav.appendChild(oSpan1);
                    break;
            }
            checkAll();
            filData();  //根据nowPID筛选数据
            if(isView){
                newBuilt(data);  //根据数据渲染页面
            }else{
                newDetail(data);
            }
            
        };
        
        ///////////////////////////////////// 鼠标右键 /////////////////////////////////////
    
        oBigRename.oncontextmenu = oFile_menu.oncontextmenu =  oContent_menu.oncontextmenu = function(ev){
            //消除右键菜单&&重命名弹窗 的右键行为
            ev.cancelBubble = true;
            ev.preventDefault();
        };
        
        oSection.oncontextmenu = function(ev){
            ev.preventDefault();
            oFile_menu.style.zIndex = '';  //文件夹上的右键菜单消失
            clearCheck();   //清除文件夹的选中状态
            oBigRename.style.cssText = '';  //隐藏重命名弹窗
            oInsulate = false;  //改变重命名隔离开关的状态
    
            if(isNewFile){  //如果是在新建文件夹时 右键 还要删除文件夹
                oContent.removeChild(oContent.children[1]);
                isNewFile = false;  //新建文件夹开关关闭
            }
            
            var l = ev.clientX - oSection.offsetLeft;
            var t = ev.clientY - oSection.offsetTop;
            
            var iH = oSection.offsetHeight;//父级section的高度
            var iW = oSection.offsetWidth;
            
            var oH = oContent_menu.offsetHeight;//右键菜单自身的高度
            var oW = oContent_menu.offsetWidth;
            
            if( (t+oH) > iH ) t = t - oH;
            if( (l+oW) > iW ) l = l - oW;
            
            oContent_menu.style.left = l + 'px';
            oContent_menu.style.top = t + 'px';
            oContent_menu.style.zIndex = 6;
            
            var oC1 = oContent_menu.firstElementChild;  //新建文件夹
            var oC2 = oContent_menu.children[1];  //刷新
            var oC3 = oContent_menu.children[2];  //后退
            
            oC1.onclick = newFile;  //新建文件夹执行函数
            oC2.onclick = function(){location.reload();};
            
            if(nowPID == 0){
                oC3.style.display = 'none';
            }else{
                oC3.style.display = 'block';
                oC3.onclick = prevFloor;  //后退
            }
        };
    
        document.onclick = function(){
            oContent_menu.style.zIndex = '';
            oFile_menu.style.zIndex = '';
        };
    
        ///////////////////////////////////// 鼠标框选 /////////////////////////////////////
        
        Resize();
        window.onresize = Resize;
        function Resize(){oContent.style.height = window.innerHeight - 182 + 'px';}
        
        var oArea = document.getElementById('area');  //获取到选框
        oContent.onmousedown = function(ev){
            if(oInsulate) return;  //重命名时不能执行操作
            ev.preventDefault();
            isDown = true;  //鼠标按下时开关关闭;
            
            oArea.style.display = 'block';
            oArea.oL = ev.clientX;
            oArea.oT = ev.clientY;
            
        };
        
        document.onmousemove = function(ev){
            ev.preventDefault();
            if(isDown){  //鼠标抬起时不执行下面代码
                var iL = ev.clientX;  //获取到当前鼠标的定位
                var iT = ev.clientY;
                var oS_attr = oSection.getBoundingClientRect();  //父元素属性的集合
    
                if(iL >= oS_attr.right) iL = oS_attr.right;
                if(iT >= oS_attr.bottom) iT = oS_attr.bottom;
    
                var disX = oSection.offsetLeft;
                var disY = oSection.offsetTop;
    
                if(iL < oArea.oL){
                    oArea.style.left = iL - disX + 'px';
                    oArea.style.width = oArea.oL - iL + 'px';
                }else{
                    oArea.style.left = oArea.oL - disX + 'px';
                    oArea.style.width = iL - oArea.oL + 'px';
                }
    
                if( iT < oArea.oT){
                    oArea.style.top = iT - disY + 'px';
                    oArea.style.height = oArea.oT - iT + 'px';
                }else{
                    oArea.style.top = oArea.oT - disY + 'px';
                    oArea.style.height = iT - oArea.oT + 'px';
                }
    
                //碰撞检测文件夹
                for(var i=1; i<oConDl.length; i++){
                    if(Duang(oArea,oConDl[i])){
                        oConDl[i].children[2].index = 1;
                        oConDl[i].children[2].style.display = 'block';
                        oConDl[i].children[2].style.backgroundImage = 'url(img/checker0.png)';
                        oConDl[i].className = 'click';
                    }else{
                        oConDl[i].children[2].index = 0;
                        oConDl[i].children[2].style.cssText = '';
                        oConDl[i].className = '';
                    }
                }
            }
            
            if(isDrag){
                var l = ev.clientX;  //获取当前鼠标的位置
                var t = ev.clientY;
                var er = null;
                var nr = 99999;
                var el = null;
                var nl = -99999;
                var et = null;
                var nt = 99999;
                var eb = null;
                var nb = -99999;
                
                var oC = oContent.getBoundingClientRect();
                for(var i=0; i<cloneFile.length; i++){
                    if(cloneFile[i].disX < nr){
                        nr = cloneFile[i].disX;
                        er = cloneFile[i];  //最右边的
                    }
    
                    if(cloneFile[i].disX > nl){
                        nl = cloneFile[i].disX;
                        el = cloneFile[i];  //最左边的
                    }
    
                    if(cloneFile[i].disY < nt){
                        nt = cloneFile[i].disY;
                        et = cloneFile[i];  //最上边的
                    }
    
                    if(cloneFile[i].disY > nb){
                        nb = cloneFile[i].disY;
                        eb = cloneFile[i];  //最上边的
                    }
                }
                
                for(var i=0; i<cloneFile.length; i++){
                    
                    if((l-er.disX + el.offsetWidth) >= oContent.getBoundingClientRect().right){
                        l = er.getBoundingClientRect().right + er.disX  - er.offsetWidth;
                    }
                    if((t-eb.disY + eb.offsetHeight) >= oContent.getBoundingClientRect().bottom){
                        t = eb.getBoundingClientRect().bottom + eb.disY  - er.offsetHeight;
                    }
                    
                    if((l - el.disX) <= oContent.getBoundingClientRect().left){
                        l = el.getBoundingClientRect().left + el.disX;
                    }
                    if((t - et.disY) <= oContent.getBoundingClientRect().top){
                        t = et.getBoundingClientRect().top + el.disY;
                    }
                    
                    cloneFile[i].style.left = (l-cloneFile[i].disX - oC.left) + 'px';
                    cloneFile[i].style.top = (t-cloneFile[i].disY - oC.top) + 'px';
                }
            }
        };
        
        document.onmouseup = function(ev){
            var l = ev.clientX;
            var t = ev.clientY;
            var cloneE = null;
            
            oArea.style.cssText = '';  //选框消失
            isDown = false;  //鼠标抬起时开关打开
            for(var i=0; i<cloneFile.length; i++){
                if(cloneFile[i].ID == nn1){
                    cloneE = cloneFile[i];
                }
            }
            
            if(isDrag){
                for(var k=1; k<oConDl.length; k++){
                    
                    if(Duang1(l,t,oConDl[k]) && oConDl[k] !== cloneE ){
                        
                        for(var i=0; i<checkFile.length; i++){
                            for(var j=0; j<data.length; j++){
                                if(checkFile[i].ID == data[j].ID){
                                    data[j].PID = oConDl[k].ID;  //修改了data中的数据aData中的也跟着改变了
                                }
                            }
                        }
        
                        for(var j=1; j<oConDl.length; j++) {
                            for (var i = 0; i < checkFile.length; i++) {
                                if (oConDl[j].ID == checkFile[i].ID) {
                                    oContent.removeChild(oConDl[j]);  //删掉DOM结构
                                    j--;
                                }
                            }
                        }
                        filData();  //因为PID的改变需要 重新筛选data数据
                    }
                }
        
                for(var j=0; j<checkFile.length; j++){
                    for(var i=0; i<cloneFile.length; i++){  //对文件夹定位
                        if(checkFile[j].ID == cloneFile[i].ID){
                            checkFile[j].style.position = 'absolute';
                            checkFile[j].style.margin = 0;
                            checkFile[j].style.top = cloneFile[i].offsetTop + 'px';
                            checkFile[j].style.left = cloneFile[i].offsetLeft + 'px';
                        }
                    }
                }
                
                for(var i=0; i<oConDl.length; i++){  //鼠标抬起删掉克隆的文件夹
                    if(oConDl[i].ty == 'clone'){
                        oContent.removeChild(oConDl[i]);
                        i--;
                    }
                }
                
                //noinspection JSDuplicatedDeclaration //解绑拖动事件
                for(var j=0; j<checkFile.length; j++){  //鼠标抬起时清空选中文件夹的事件
                    checkFile[j].onmousedown = null;
                }
            }
            isDrag = false;  //拖拽开关
            cloneFile = [];
            checkFile = [];
            for(var i=1; i<oConDl.length; i++){
                if(oConDl[i].children[2].index == 1){
                    checkFile.push(oConDl[i])
                }
            }
            Drag(checkFile);
            checkAll();  //鼠标抬起时判断是否框选了所有的文件夹
        };
        
        
        
        function Drag(arr){
            for(var i=0; i<arr.length; i++){
                arr[i].onmousedown = function(ev){
                    
                    if(ev.which != 1) return;
                    if(checkFile.length == 0) return;
                    if(this.children[2].index != 1) return;
                    
                    var l = ev.clientX;  //当前鼠标位置
                    var t = ev.clientY;
                    nn1 = this.ID;
                    
                    for(var j=0; j<arr.length; j++){
                        
                        var iL = arr[j].offsetLeft;  //文件夹自身相对于父级的定位
                        var iT = arr[j].offsetTop;
                        
                        var clone = arr[j].cloneNode(true);
                        clone.ID = arr[j].ID;
                        clone.ty = 'clone';  //添加一个自定义属性 方便删除
                        clone.disX = l - arr[j].getBoundingClientRect().left;  //为每个选中的文件夹添加自定义属性
                        clone.disY = t - arr[j].getBoundingClientRect().top;
                        clone.style.cssText = 'position:absolute; left:'+ iL +'px; top:'+ iT +'px; opacity:0.5;margin:0; z-index:8;';
                        oContent.insertBefore(clone,oContent.children[1]);
                        cloneFile.push(clone);
                    }
                    isDrag = true;
                };
            }
        }
    
        /** @return {boolean}碰撞检测函数 */
        function Duang(obj1,obj2){
            if(obj1 === obj2) return;
        
            var attr1 = obj1.getBoundingClientRect();
            var attr2 = obj2.getBoundingClientRect();
            return !(attr1.bottom < attr2.top || attr1.left > attr2.right || attr1.top > attr2.bottom || attr1.right < attr2.left);
        }
    
        /** @return {boolean}碰撞检测函数 */
        function Duang1(l,t,obj2){
            for(var i=0; i<checkFile.length; i++){
                if(obj2 == checkFile[i]){
                    return false;
                }
            }
            var attr2 = obj2.getBoundingClientRect();
            return !(t < attr2.top || l > attr2.right || t > attr2.bottom || l < attr2.left);
        }
        
    }();
};