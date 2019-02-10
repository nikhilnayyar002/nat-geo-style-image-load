
function natGeoImg(obj){
	let mn=document.querySelector(`${obj.parent}`);
	let block=document.createElement('div');
	Object.assign(block.style,{width:"100%",height:"100%",position:"relative"});
	//block.classList.add("temp");
	mn.appendChild(block);
	let comp=document.createElement('div');
	let compm=document.createElement('div');
	compm.className = "nat-geo-comp-main";
	comp.className = 'nat-geo-comp';
	compm.style.zIndex=`${obj.frames}`;
	mn.appendChild(block);
	block.appendChild(compm);
	compm.appendChild(comp);
	let p=document.createElement('p');
	let h2=document.createElement('h2');
	compm.appendChild(h2);	compm.appendChild(p);
	return new natgeoImageBag(obj,block,[h2,p,compm]);
}

function natgeoImageBag(obj,block,txt) { 
	let i=0,r,sett=0,max=90,initial=0,nxtimgctr=-1,myVar,started=false,childs,dull=obj.dullness,error=false;
	let uris;
	let mn=document.querySelector(`${obj.parent}`);
	let w=mn.clientWidth,h=mn.clientHeight,tot=obj.frames;
	function initialize() {
		for(let t=0;t<obj.frames;++t) {
			let d=document.createElement('div');
			d.classList.add("cont");
			d.style.zIndex=`${t}`;
			block.appendChild(d);
			d.style.clip=`rect(0px,${w*(tot-t)/tot}px,${h}px,0px)`;
			d.style.transformOrigin=`${100*(tot-t-1)/tot}% 50%`;
		}
		childs=document.querySelectorAll(`${obj.parent} div .cont`);
		txt[0].innerHTML="Loading!"
		let o=obj.array,arr=[],count=0;
		for(let i=0;i<o.length;i++) 
	 		arr[i]=new Promise(function(resolve,request) {
					let myRequest = new Request(o[i]);
					fetch(myRequest)
					.then(function(response) {
  						if (!response.ok) 
    							throw new Error('HTTP error, status = ' + response.status);
    						txt[1].innerHTML=`${++count/o.length*100} Done.`;
  						return response.blob();
					})
					.then(function(response) {
  						let objectURL = URL.createObjectURL(response);
  						resolve( objectURL );
					})
					.catch(() => {
						error=true;
    						txt[0].innerHTML="Error!";
    						txt[1].innerHTML="Something failed. Please trying reload.";
					});
				});
		Promise.all(arr).then(function(values) {
 
			uris=values

			setTimeout(()=> {myVar=setInterval(frame,obj.timeK)},1000);
		});
	}
	frame= function(){
		let chunk=block.clientWidth/obj.frames;
		let  k1=(i-initial)/max;let k2=1-k1;
		++i;
		if(i>max+initial) {
			i=0; sett=0; clearInterval(myVar);
			if(obj.collection===true) { r=0;myVar=setInterval(frame2,obj.timeK);}
         	}
		if(i>initial){
			if(!sett) {
				let str=`url(${nextImg(uris,obj.names,txt)}) no-repeat center`; 
				for(let t=0;t<childs.length;++t) {			
					childs[t].style.background=str;
					childs[t].style.backgroundSize="cover";
				}
				sett=1;
			}
         		for(let t=0;t<childs.length;++t) {
				childs[t].style.transform=`rotateY(${max*k2}deg)`;
           			childs[t].style.opacity=`${k1-dull}`;
           			txt[2].style.opacity=`${k1}`;
				//Object.assign(block.style,{width:`${100-k1*5}%`,height:`${100-k1*10}%`});
			}
		}
	}
	frame2= function()  {
		let initial=obj.time/obj.timeK, mid=initial*3/4;
		++i;
		if(i>initial) {
			i=0; clearInterval(myVar);//block.style.left="0";
         		for(let t=0;t<childs.length;++t) childs[t].style.left="0";
			setTimeout(()=> {myVar=setInterval(frame,obj.timeK)},1000);
         	}
		if(i>mid) { let k=(r/initial); ++r;
         		for(let t=0;t<childs.length;++t) 
			Object.assign(childs[t].style,{left:`${(tot-t)*k*100}px`,opacity:`${1-k-0.8}`});
		}
		//else { let k1=(i/initial); block.style.left=`${k1*50}px`; }
	}
	nextImg=function(arr,names,txt) {
			if(arr) {
				++nxtimgctr; if(nxtimgctr===arr.length) nxtimgctr=0;
				if(names&&names[nxtimgctr]) {
					txt[0].innerHTML=names[nxtimgctr][0]; txt[1].innerHTML=names[nxtimgctr][1];
				}
				else txt[0].innerHTML=txt[1].innerHTML="";
				return arr[nxtimgctr];
			}
			return "";
	}
	this.start=function () { 
			if(!started) {
				if(!childs) initialize();
				else
				setTimeout(()=> {myVar=setInterval(frame,obj.timeK)},1000);
				started=true;
			}
	};

	this.stop=function () { if(started) {clearInterval(myVar);started=false;} };
}

