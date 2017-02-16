window.onload = function(){
    !function(){
        //PID 表示是谁的(ID)子级
        var aData = [{PID:0,ID:1, name:'字体'},{PID:0,ID:2, name:'软件'},{PID:0,ID:3, name:'视频'},{PID:0,ID:4, name:'电子书'},{PID:1,ID:5, name:'方正字体'},{PID:1,ID:6, name:'兰亭字体'},{PID:2,ID:7, name:'PS'},{PID:2,ID:8, name:'DW'},{PID:2,ID:9, name:'AI'},{PID:3,ID:10, name:'设计教程'},{PID:3,ID:11, name:'HTML5'},{PID:3,ID:12, name:'CSS3'},{PID:4,ID:13, name:'高级程序设计'},{PID:10,ID:14, name:'平面设计'}];
        var data = [];//存储筛选数据
        var num = aData.length;//num++ 控制ID值得改变
        var nowPID = 0;//记录父级的ID,默认值是0
        var nnn = '';

        var oYun = document.getElementById('baiduyun');
        var aBtn = oYun.getElementsByClassName('btn');//aBtn[0]-新建  aBtn[1]-删除  aBtn[2]-重命名
        var oContent = oYun.getElementsByClassName('content')[0];
        var oTxt = oYun.getElementsByClassName('txt')[0];//oTxt.children[0]-面包屑导航  oTxt.children[1]-数量统计
        var oCrumbNav = oTxt.children[0];//面包屑导航
        var path = [];//记录点击路径
        
        var oCheckBox = oYun.getElementsByClassName('checkbox')[0];//全选
        var oBigRename = oYun.getElementsByClassName('bigrename')[0];//重命名
        var oInput = oBigRename.getElementsByTagName('input')[0];//重命名输入框

        var oTrue = oBigRename.getElementsByClassName('true')[0];//重命名 - √
        var oFalse = oBigRename.getElementsByClassName('false')[0];//重命名 - ×
        
        var oContainer = null;//记录重命名时被选中的哪个对象
        var oInsulate = false;//隔离开关-控制重命名时的其余不能操作

        var oNewObj = null;//存储新建的数据赋址
        var storPID = null;

        var arrName = [];//存贮新建文件夹名字
        var fileNum = 15;//新建文件夹的数量

        var arrName2 = ['新建文件夹'];//新建文件夹名字-用于比较
        for(var i=2; i<fileNum; i++){
            arrName2.push('新建文件夹' + '(' + i + ')');
        }
    
        filData();//筛选数据存入data中
        newBuilt(data);//根据data数据渲染页面

        var oCheckBtn = oCheckBox.getElementsByTagName('b')[0];//全选的复选框
        var oCheckTxt = oCheckBox.getElementsByTagName('span')[0];//全选后面的文字内容

        //全选按钮点击事件
        oCheckBtn.onclick = function(){
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
        aBtn[0].onclick = function(){
            if(oInsulate) return;//重命名时不能执行新建操作
            oInsulate = true;
            
            for(var i=1; i<oContent.children.length; i++){
                var oIconDd = oContent.children[i].children[2];
                oIconDd.index = 0;
                oIconDd.style.display = '';
                oIconDd.style.backgroundImage = '';
                oIconDd.parentNode.className = '';

            }

            var a = {};
            a.PID = nowPID;
            a.ID = ++num;
            a.name = '';
            oNewObj = a;

            newBuilt([a]);
            console.log(storPID,nowPID);
            if(storPID != nowPID){
                arrName = [];
                for(var i=1; i<fileNum; i++){
                    arrName.push('新建文件夹' + '(' + i + ')');
                }
            }
    
            filData();
            //如果是新建文件夹系列，删除数据
            for(var i=0; i<arrName.length; i++){
                for(var j=0; j<data.length; j++){
                    if(arrName[i] == data[j].name){
                        arrName.splice(i,1)
                    }
                }
            }
            console.log(arrName);
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
            checkAll();
            storPID = nowPID;
            console.log(data);
        };
        
        function deleteE(n){
            
                
                
                for(var i=0; i<aData.length; i++){
                    if(aData[i].PID == n){
                        deleteE(aData[i].ID);
                        aData.splice(i,1);
                        i--;
                    }
                }
            
        }
        
        //删除按钮
        aBtn[1].onclick = function(){
            if(oInsulate) return;//重命名时不能执行删除操作

            for(var i=1; i<oContent.children.length; i++){
                if(oContent.children[i].children[2].index == 1){
                    //删除数据
                    
                    nnn = oContent.children[i].ID;
                    deleteE(nnn);
                    
                    for(var i=0; i<aData.length; i++){
                        if(aData[i].ID == nnn){
                            aData.splice(i,1);
                            i--;
                        }
                    }
                    
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

            arrName.sort(function(a,b){
                return parseInt(a.substr(6)) - parseInt(b.substr(6));
            });
            
            checkAll();
            oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
            console.log(aData);
        };

        //重命名按钮
        aBtn[2].onclick = function(){
            if(oInsulate) return;//重命名时不能执行操作

            var num1 = 0;//记录有几个选中
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
            console.log(data);
        };

        function fn(){
            //重命名 - √
            oTrue.onclick = function(){
                var oInputText = oContainer.children[1].firstElementChild.innerHTML;
                for(var i=0; i<data.length; i++){
                    if(oInput.value == data[i].name && oInput.value != oContainer.children[1].firstElementChild.innerHTML){
                        alert('名字重复!!');
                        break;
                    }else{
                        //修改DOM
                        oContainer.children[1].firstElementChild.innerHTML = oInput.value;
                        oBigRename.style.cssText = '';
                        //修改数据
                        if(data[i].ID == oContainer.ID){
                            data[i].name = oInput.value;
                        }
                        
                        oInsulate = false;//隔离开关
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
                oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
            };

            //新建文件夹 - 点击×
            oFalse.onclick = function(){
                oBigRename.style.cssText = '';
                oContent.removeChild(oContent.children[1]);
                oInsulate = false;//隔离开关
            };
        }
        
        //全选函数
        function checkAll(){
            var n=0;
            for(var i=1; i<oContent.children.length; i++){
                var oIconDd = oContent.children[i].children[2];
                if(oIconDd.index == 1){
                    n++;
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
            }
            if(oContent.children.length == 1){
                oCheckBtn.index = 1;
                oCheckBtn.style.backgroundPosition = '';
                oCheckTxt.innerHTML = '全选';
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
                oIconDd.onclick = function(){
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
                    checkAll();
                };

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
                    console.log(this.PID,this.ID);
                    nowPID = this.ID;//记录父级的ID
                    console.log(data);
                    if(this.PID == 0){
                        location.hash = 'path=%2F';
                    }
                    for(var i=0; i<data.length; i++){
                        if(this.ID == data[i].ID){
                            path.push(data[i]);//存入的是点击谁
                            location.hash += data[i].name + '%2F';
                        }
                    }
                    console.log(path);
                };
            }

            oTxt.children[1].innerHTML ='已全部加载，共'+ data.length +'个';
        }
    
        //根据hash值的改变，控制页面重新渲染数据
        window.onhashchange = function(){
            oCrumbNav.innerHTML = '';
            for(var i=data.length; i>0; i--){//清空所有文件夹
                oContent.removeChild(oContent.children[i]);
            }
            
            if(location.hash == '#path=%2F'){
                oCrumbNav.innerHTML = '<span>全部文件</span>';
                filData();//根据nowPID筛选数据
                newBuilt(data);//根据数据渲染页面
                return;
            }
            //////////////////////////////返回上一级///////////////////////////////
            var oPrev = document.createElement('a');
            oPrev.className = 'blue';
            oPrev.href = 'javascript:void(0)';
            oPrev.innerHTML = '返回上一级';
            oCrumbNav.appendChild(oPrev);
            
            oPrev.onclick = function(){
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
                        location.hash += path[i].name + '%2F';
                    }
                }
                checkAll();
            };
            
            var oLine = document.createElement('span');
            oLine.className = 'blue';
            oLine.innerHTML = ' | ';
            oCrumbNav.appendChild(oLine);
            //////////////////////////////全部文件///////////////////////////////
            var oAllFile = oPrev.cloneNode(true);
            oAllFile.innerHTML = '全部文件';
            oCrumbNav.appendChild(oAllFile);
            oAllFile.PID = 0;
            
            oAllFile.onclick = function(){//点击全部文件
                nowPID = this.PID;
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
                        ///////////////////////////////其中任意一个///////////////////////////////
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
                                location.hash += path[i].name + '%2F';
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
            filData();//根据nowPID筛选数据
            newBuilt(data);//根据数据渲染页面
        }
        
    }();
};