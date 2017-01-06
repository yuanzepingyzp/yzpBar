window.onload=function(){
	new YzpBar([10,30,10,20,90,40,50,60],["项目一","项目二","项目三","项目四","项目五","项目六","项目七","项目八"],"rgb(100,200,200)");
}
var tool={
	getStartlist:function(data,origin,xend){
		var startList=[];
		var inteval=(xend[0]-origin[0]-30)/data.length;
		for(var i=0;i<data.length;i++){
			var current=[];
			current[0]=origin[0]+inteval*(i+1);
			current[1]=origin[1];
			startList.push(current);
		}
		return startList;
	},
	getEndlist:function(startcoord,data,k){
		var endcoord=[];
		endcoord[0]=startcoord[0];
		endcoord[1]=startcoord[1]-data*k;
		return endcoord;
	},
	getMax:function(data){
		var max=data[0];
		for(var i=0;i<data.length;i++){
			if(data[i]>max){
				max=data[i];
			}else{
				continue;
			}
		}
		return max;
	},
	ismouseover:function(event,start,end,width){
		if(Math.abs(event.clientY-(start[1]+end[1])/2)<(start[1]-end[1])&&Math.abs(event.clientX-start[0])<width){
			return true;
		}
	}
}

function YzpBar(data,dataname,color){
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");

	this.data=data;
	this.dataname=dataname;
	this.color=color;
	this.axis={
		origin:[100,500],
		yend:[100,100],
		xend:[500,500],
	};
	this.k=(function(This){
		return (This.axis.origin[1]-This.axis.yend[1])/tool.getMax(This.data);
	})(this);
	this.render=function(){
		var maxData=tool.getMax(this.data);
		new Axis(context,this.axis.origin,this.axis.xend,this.axis.yend,maxData);
		var startList=tool.getStartlist(this.data,this.axis.origin,this.axis.xend);
		for(var i=0;i<this.data.length;i++){
			var endcoord=tool.getEndlist(startList[i],this.data[i],this.k);
			new Bar(context,startList[i],endcoord,this.data[i],this.dataname[i],this.axis.origin);
		}
	};
	this.init=(function(This){
		This.render();
	})(this);
};
function Bar(context,start,end,data,dataname,axisorigin){
	var canvas=document.getElementById("canvas");

	this.context=context;
	this.start=start;
	this.end=end;
	this.data=data;
	this.dataname=dataname;
	this.width=30;
	this.color="rgb(100,200,200)";
	this.axisorigin=axisorigin;
	this.render=function(){
		drawMath.line(this.context,this.start,this.end,this.width,this.color);
		drawMath.text(context,this.dataname,this.start[0]-this.width/2,this.start[1]+20,"rgb(100,200,200)");
	};
	this.eventListener=function(){
		var This=this;
		canvas.addEventListener('mousemove',function(event){
			if(tool.ismouseover(event,This.start,This.end,This.width)){
				This.showInfor(event);
			}else{
				This.hideInfor();
			}
		});
	};
	this.showInfor=function(event){
		id=this.dataname+"inforbox";
		if(document.getElementById(id)){
			canvas.parentNode.removeChild(document.getElementById(id));
		}
		var div=document.createElement("div");
		div.setAttribute("id",id);
		div.innerHTML="<div style='position:absolute;width:100px;height:50px;background-color:rgba(10,10,10,0.5);text-align:center;line-height:50px;color:white;top:"+(this.start[1]+this.end[1])/2+"px;left:"+(this.start[0]+this.width)+"px;'>"+this.dataname+":"+this.data+"</div>";
		canvas.parentNode.appendChild(div);
	};
	this.hideInfor=function(){
		id=this.dataname+"inforbox";
		if(document.getElementById(id)){
			canvas.parentNode.removeChild(document.getElementById(id));
		}
	};
	this.init=(function(This){
		This.render();
		This.eventListener();
	})(this);
};

function Axis(context,origin,xend,yend,maxData){
	this.maxData=maxData;
	this.context=context;
	this.color="rgb(200,200,200)";
	this.width=1;
	this.xend=xend;
	this.origin=origin;
	this.yend=yend;
	this.render=function(){
		var step=maxData/20;
		var interval=(this.origin[1]-this.yend[1])/20;
		drawMath.line(this.context,this.origin,this.xend,this.width,this.color);
		drawMath.line(this.context,this.origin,this.yend,this.width,this.color);
		for(var i=0;i<20;i++){
			var start=[this.origin[0],this.origin[1]-i*interval];
			var end=[this.origin[0]+10,this.origin[1]-i*interval];
			drawMath.text(this.context,i*step,start[0]-30,start[1]);
			drawMath.line(this.context,start,end,this.width,this.color);
		}
	};
	this.init=(function(This){
		This.render();
	})(this);
}

var drawMath={
	line:function(context,start,end,width,color){
		context.beginPath();
		context.moveTo(start[0],start[1]);
		context.lineTo(end[0],end[1]);
		context.lineWidth=width;
		context.strokeStyle=color;
		context.stroke();
	},
	text:function(context,content,x,y,color){
		context.beginPath();
		context.font="Regular 10px 微软雅黑";
		context.strokeStyle=color;
		context.lineWidth=1;
		context.strokeText(content,x,y);
	}
}
