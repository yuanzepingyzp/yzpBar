window.onload=function(){
	new YzpBar([10,30,10,20,50,40],"rgb(100,200,200)");
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
	}
}

function YzpBar(data,color){
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");

	this.data=data;
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
		console.log(this.k);
		new Axis(context,this.axis.origin,this.axis.xend,this.axis.yend);
		var startList=tool.getStartlist(this.data,this.axis.origin,this.axis.xend);
		for(var i=0;i<this.data.length;i++){
			var endcoord=tool.getEndlist(startList[i],this.data[i],this.k);
			new Bar(context,startList[i],endcoord);
		}
	};
	this.init=(function(This){
		This.render();
	})(this);
};
function Bar(context,start,end){
	this.context=context;
	this.start=start;
	this.end=end;
	this.width=20;
	this.color="rgb(100,200,200)";
	this.render=function(){
		drawMath.line(this.context,this.start,this.end,this.width,this.color);
	};
	this.init=(function(This){
		This.render();
	})(this);
};

function Axis(context,origin,xend,yend){
	this.context=context;
	this.color="rgb(200,200,200)";
	this.width=1;
	this.xend=xend;
	this.origin=origin;
	this.yend=yend;
	this.render=function(){
		drawMath.line(this.context,this.origin,this.xend,this.width,this.color);
		drawMath.line(this.context,this.origin,this.yend,this.width,this.color);
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
	}
}
